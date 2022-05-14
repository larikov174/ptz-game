const CONST = {
  GAME_WIDTH: 990,
  GAME_HEIGHT: 1100,
  GAME_BACKGROUND: 0xffffff,
  OVERLAY_COLOR: 0x000000,
  START_X: 75,
  START_Y: 203,
  CUBE_WIDTH: 140,
  CUBE_HEIGHT: 135,
  FRAMES: ['CUBE_CHETRA', 'CUBE_DOZER', 'CUBE_FPK', 'CUBE_MKSM', 'CUBE_PK'],
  SCORE: 0,
  GOAL: 5,
  TIME: 30,
  LEVEL: 1,
  HIGHSCORE: 0,
  INLINE_LIMIT: 7,
  INLINE_LIMIT_Y: 7,
  FONT_PROPS: {
    FAMILY: 'Calibri',
    SIZE_XL: 90,
    SIZE_L: 48,
    SIZE_M: 32,
    SIZE_S: 24,
    FC_YELLOW: '#F0AF1D',
    FC_PURPLE: '#4B2942',
    FC_WHITE: '#FFFFFF',
    FC_BLACK: '#000000',
  },
  TEXT: {
    BEGIN_TEXT: 'Нажмите, чтобы начать игру',
    NEW_RECORD: 'Отлично, Вы установили свой рекорд!',
    CHEERUP: 'Вы можете лучше, поднажмите!',
    NEW_SCORE: 'Ваш новый результат(очков):',
    BEST_SCORE: 'Ваш лучший результат(очков):',
    AGAIN: 'Попробуем еще раз?!',
  },
  DB_URL: 'https://chetra.herokuapp.com',
  // DB_URL: 'http://localhost:3001',
};

export default CONST;
