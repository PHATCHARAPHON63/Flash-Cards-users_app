export const rooms_data = [
  {
    _id: 1,
    level: 'ม.1',
    room: '1'
  },
  {
    _id: 2,
    level: 'ม.1',
    room: '2'
  },
  {
    _id: 3,
    level: 'ม.2',
    room: '1'
  },
  {
    _id: 4,
    level: 'ม.2',
    room: '2'
  },
  {
    _id: 5,
    level: 'ม.3',
    room: '1'
  },
  {
    _id: 6,
    level: 'ม.3',
    room: '2'
  },
  {
    _id: 7,
    level: 'ม.4',
    room: '1'
  },
  {
    _id: 8,
    level: 'ม.4',
    room: '2'
  },
  {
    _id: 9,
    level: 'ม.5',
    room: '1'
  },
  {
    _id: 10,
    level: 'ม.5',
    room: '2'
  },
  {
    _id: 11,
    level: 'ม.6',
    room: '1'
  },
  {
    _id: 12,
    level: 'ม.6',
    room: '2'
  }
];

const levelUniqe = rooms_data.map((room) => room.level);

export const roomOptions = [...new Set(levelUniqe)].map((level) => ({
  value: level,
  name: level
}));
