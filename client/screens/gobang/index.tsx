import { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Screen } from '@/components/Screen';

const BOARD_SIZE = 15; // 15x15 棋盘
const CELL_SIZE = Math.min((Dimensions.get('window').width - 40) / BOARD_SIZE, 28);
const PIECE_SIZE = CELL_SIZE * 0.85;

type Player = 'black' | 'white' | null;
type Board = Player[][];

interface Position {
  row: number;
  col: number;
}

export default function GobangPage() {
  const [board, setBoard] = useState<Board>(() => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [winner, setWinner] = useState<'black' | 'white' | 'draw' | null>(null);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const boardRef = useRef<View>(null);

  const checkWin = useCallback((board: Board, row: number, col: number, player: 'black' | 'white'): boolean => {
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线
      [1, -1],  // 反对角线
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      // 正向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === player) {
          count++;
        } else break;
      }
      // 反向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === player) {
          count++;
        } else break;
      }
      if (count >= 5) return true;
    }
    return false;
  }, []);

  const handlePress = useCallback((row: number, col: number) => {
    if (winner || board[row][col]) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setLastMove({ row, col });

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      setTimeout(() => {
        Alert.alert(
          '游戏结束',
          `${currentPlayer === 'black' ? '黑方' : '白方'}获胜！`,
          [{ text: '再来一局', onPress: resetGame }]
        );
      }, 100);
      return;
    }

    // 检查是否平局（棋盘下满）
    const isFull = newBoard.every(row => row.every(cell => cell !== null));
    if (isFull) {
      setWinner('draw');
      setTimeout(() => {
        Alert.alert('游戏结束', '平局！', [{ text: '再来一局', onPress: resetGame }]);
      }, 100);
      return;
    }

    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  }, [board, currentPlayer, winner, checkWin]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('black');
    setWinner(null);
    setLastMove(null);
  }, []);

  const renderPiece = (player: Player, row: number, col: number) => {
    if (!player) return null;
    const isLastMove = lastMove?.row === row && lastMove?.col === col;
    return (
      <View
        style={[
          styles.piece,
          player === 'black' ? styles.blackPiece : styles.whitePiece,
          isLastMove && styles.lastMovePiece,
        ]}
      />
    );
  };

  const renderBoard = () => {
    const cells = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isCenter = row === 7 && col === 7;
        const isStarPoint = (row === 3 && col === 3) || (row === 3 && col === 11) ||
                          (row === 11 && col === 3) || (row === 11 && col === 11) ||
                          (row === 7 && col === 3) || (row === 7 && col === 11) ||
                          (row === 3 && col === 7) || (row === 11 && col === 7);
        cells.push(
          <TouchableOpacity
            key={`${row}-${col}`}
            style={[
              styles.cell,
              { width: CELL_SIZE, height: CELL_SIZE },
            ]}
            onPress={() => handlePress(row, col)}
            disabled={!!winner}
            activeOpacity={0.7}
          >
            {/* 网格线 */}
            <View style={[styles.gridLine, styles.horizontalLine, { top: CELL_SIZE / 2 }]} />
            <View style={[styles.gridLine, styles.verticalLine, { left: CELL_SIZE / 2 }]} />
            {/* 星位点 */}
            {isStarPoint && <View style={styles.starPoint} />}
            {/* 棋子 */}
            {renderPiece(board[row][col], row, col)}
          </TouchableOpacity>
        );
      }
    }
    return cells;
  };

  return (
    <Screen statusBarStyle="dark">
      <View className="flex-1 items-center justify-start pt-4">
        {/* 标题 */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">五子棋</Text>

        {/* 当前玩家指示 */}
        <View className="flex-row items-center mb-4">
          <View style={[styles.piece, styles[currentPlayer === 'black' ? 'blackPiece' : 'whitePiece'], { width: 20, height: 20 }]} />
          <Text className="ml-2 text-base text-gray-600">
            {winner ? (winner === 'draw' ? '平局' : `${winner === 'black' ? '黑方' : '白方'}获胜`) : `${currentPlayer === 'black' ? '黑方' : '白方'}落子`}
          </Text>
        </View>

        {/* 棋盘 */}
        <View style={[styles.board, { padding: CELL_SIZE / 2 }]} ref={boardRef}>
          <View style={styles.boardInner}>
            {renderBoard()}
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="flex-row mt-6">
          <TouchableOpacity
            style={styles.button}
            onPress={resetGame}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">重新开始</Text>
          </TouchableOpacity>
        </View>

        {/* 规则说明 */}
        <View className="mt-6 mx-4 px-4 py-3 bg-gray-50 rounded-xl">
          <Text className="text-xs text-gray-500 text-center">游戏规则：黑白双方轮流落子，先在横/竖/斜方向连成5子者获胜</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#DEB887',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  boardInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#8B7355',
  },
  horizontalLine: {
    height: 1,
    left: 0,
    right: 0,
  },
  verticalLine: {
    width: 1,
    top: 0,
    bottom: 0,
  },
  starPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B7355',
    zIndex: 0,
  },
  piece: {
    position: 'absolute',
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: PIECE_SIZE / 2,
    zIndex: 1,
  },
  blackPiece: {
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  whitePiece: {
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  lastMovePiece: {
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
