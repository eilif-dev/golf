export interface Hole {
  number: number
  par: number
  distance: number // meters
  hcp: number
  name?: string
}

export interface Course {
  id: string
  name: string
  holes: Hole[]
  par: number
  rating: number
  slope: number
  image: string
}

export interface Player {
  id: string
  name: string
  handicap: number
  avatar: string
  rounds: number
  avgScore: number
  bestScore: number
}

export interface TeeTime {
  id: string
  courseId: string
  date: string
  time: string
  players: string[]
  maxPlayers: number
  price: number
  available: boolean
}

export interface LeaderboardEntry {
  playerId: string
  score: number
  toPar: number
  thru: number | 'F'
  movement: 'up' | 'down' | 'same'
  round: number[]
}

const makeHoles = (pars: number[], distances: number[], hcps: number[]): Hole[] =>
  pars.map((par, i) => ({ number: i + 1, par, distance: distances[i], hcp: hcps[i] }))

export const courses: Course[] = [
  {
    id: 'bogstad',
    name: 'Bogstad Banen',
    par: 72,
    rating: 72.1,
    slope: 131,
    image: '🏔️',
    holes: makeHoles(
      [4,5,3,4,4,3,4,5,4, 4,3,4,5,4,3,4,4,5],
      [385,510,175,410,370,195,405,530,380, 395,165,425,505,390,180,415,365,520],
      [7,3,15,1,9,13,5,11,17, 8,16,2,6,4,18,10,14,12]
    ),
  },
  {
    id: 'oslo-gc',
    name: 'Hovedbanen',
    par: 71,
    rating: 71.3,
    slope: 128,
    image: '🌲',
    holes: makeHoles(
      [4,4,3,5,4,4,3,4,5, 4,3,5,4,4,3,4,4,4],
      [370,395,160,495,410,385,200,420,515, 380,175,505,400,365,190,395,410,405],
      [9,3,17,5,1,7,15,11,13, 8,16,4,2,10,18,6,12,14]
    ),
  },
  {
    id: 'losby',
    name: 'Losby Banen',
    par: 72,
    rating: 73.0,
    slope: 135,
    image: '🦌',
    holes: makeHoles(
      [4,3,5,4,4,3,5,4,4, 4,5,3,4,4,5,3,4,4],
      [400,180,525,395,415,165,540,380,405, 420,510,190,385,440,530,175,395,410],
      [5,13,3,7,1,17,9,11,15, 4,6,16,8,2,10,18,12,14]
    ),
  },
]

export const players: Player[] = [
  { id: 'p1', name: 'Erik Hansen', handicap: 12.4, avatar: '👨', rounds: 47, avgScore: 84, bestScore: 76 },
  { id: 'p2', name: 'Marte Olsen', handicap: 8.2, avatar: '👩', rounds: 62, avgScore: 79, bestScore: 72 },
  { id: 'p3', name: 'Jonas Berg', handicap: 18.7, avatar: '🧑', rounds: 23, avgScore: 91, bestScore: 84 },
  { id: 'p4', name: 'Ingrid Dahl', handicap: 5.1, avatar: '👩‍🦰', rounds: 89, avgScore: 76, bestScore: 69 },
  { id: 'p5', name: 'Lars Strand', handicap: 22.3, avatar: '👴', rounds: 35, avgScore: 95, bestScore: 88 },
  { id: 'p6', name: 'Sofie Vik', handicap: 14.6, avatar: '👧', rounds: 41, avgScore: 87, bestScore: 80 },
  { id: 'p7', name: 'Henrik Moe', handicap: 3.8, avatar: '🧔', rounds: 104, avgScore: 74, bestScore: 67 },
  { id: 'p8', name: 'Thea Lund', handicap: 10.5, avatar: '👩‍🦱', rounds: 56, avgScore: 82, bestScore: 74 },
]

export const currentPlayer = players[0]

const today = new Date()
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }

export const teeTimes: TeeTime[] = []
for (let day = 0; day < 7; day++) {
  const date = formatDate(addDays(today, day))
  for (const course of courses) {
    const times = ['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','12:00','13:00','14:00','15:00','16:00']
    times.forEach((time, i) => {
      const booked = Math.random() > 0.6
      const playerCount = booked ? Math.floor(Math.random() * 3) + 1 : 0
      teeTimes.push({
        id: `${course.id}-${date}-${time}`,
        courseId: course.id,
        date,
        time,
        players: booked ? players.slice(0, playerCount).map(p => p.id) : [],
        maxPlayers: 4,
        price: day === 0 || (addDays(today, day).getDay() === 0 || addDays(today, day).getDay() === 6) ? 850 : 650,
        available: !booked || playerCount < 4,
      })
    })
  }
}

export const leaderboard: LeaderboardEntry[] = [
  { playerId: 'p7', score: 67, toPar: -5, thru: 'F', movement: 'up', round: [32, 35] },
  { playerId: 'p4', score: 69, toPar: -3, thru: 'F', movement: 'same', round: [34, 35] },
  { playerId: 'p2', score: 72, toPar: 0, thru: 'F', movement: 'up', round: [36, 36] },
  { playerId: 'p8', score: 74, toPar: 2, thru: 16, movement: 'down', round: [37, 37] },
  { playerId: 'p1', score: 78, toPar: 6, thru: 'F', movement: 'up', round: [39, 39] },
  { playerId: 'p6', score: 82, toPar: 10, thru: 'F', movement: 'down', round: [41, 41] },
  { playerId: 'p3', score: 88, toPar: 16, thru: 14, movement: 'same', round: [44, 44] },
  { playerId: 'p5', score: 92, toPar: 20, thru: 'F', movement: 'down', round: [47, 45] },
]

export const weather = {
  temp: 18,
  condition: 'Partly Cloudy',
  icon: '⛅',
  wind: '12 km/h SW',
  humidity: 65,
  sunrise: '05:42',
  sunset: '20:18',
}

export const achievements = [
  { id: 'a1', name: 'First Birdie', icon: '🐦', description: 'Score your first birdie', unlocked: true },
  { id: 'a2', name: 'Eagle Eye', icon: '🦅', description: 'Score an eagle', unlocked: true },
  { id: 'a3', name: 'Century Club', icon: '💯', description: 'Play 100 rounds', unlocked: false, progress: 47 },
  { id: 'a4', name: 'Sunrise Warrior', icon: '🌅', description: 'Tee off before 7 AM', unlocked: true },
  { id: 'a5', name: 'Hole in One', icon: '🏆', description: 'Score an ace', unlocked: false, progress: 0 },
  { id: 'a6', name: 'Course Master', icon: '🗺️', description: 'Play all 3 courses', unlocked: true },
]
