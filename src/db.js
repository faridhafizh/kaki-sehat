import Dexie from 'dexie'

const db = new Dexie('KakiSehatDB')

db.version(1).stores({
  detections: '++id, date, score, riskLevel, leftSize, rightSize, colorAvg, symmetry, imageLeft, imageRight, createdAt',
})

export default db
