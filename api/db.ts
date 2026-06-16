/**
 * Data storage adapter.
 * Uses PostgreSQL when DATABASE_URL is configured, otherwise falls back to JSON.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR =
  process.env.DATA_DIR ??
  [
    path.resolve(__dirname, '..', '..', 'data'),
    path.resolve(__dirname, '..', 'data'),
  ].find((dir) => fs.existsSync(dir)) ??
  path.resolve(__dirname, '..', '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'data.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface School {
  id: number
  name: string
}

export interface Student {
  id: number
  school_id: number
  name: string
}

export interface Submission {
  id: number
  school_id: number
  visit_student_ids: number[]
  field_trip_student_ids: number[]
  extra_participant_names?: string[]
  submitted_at: string
}

interface Database {
  schools: School[]
  students: Student[]
  submissions: Submission[]
  next_school_id: number
  next_student_id: number
  next_submission_id: number
}

const SEED: Database = {
  schools: [
    { id: 1, name: 'South China University of Technology' },
    { id: 2, name: 'National Cheng Kung University' },
    { id: 3, name: 'CEPT University' },
    { id: 4, name: 'Bandung Institute of Technology' },
    { id: 5, name: 'King Mongkut\'s University of Technology Thonburi' },
    { id: 6, name: 'Bicol State College of Applied Sciences and Technology' },
    { id: 7, name: 'Université de Montréal' },
    { id: 8, name: 'Tecnológico de Monterrey' },
    { id: 9, name: 'Technical University of Darmstadt' },
    { id: 10, name: 'RMIT University (Royal Melbourne Institute of Technology)' },
    { id: 11, name: 'Bangladesh University of Engineering and Technology' },
  ],
  students: [
    { id: 1, school_id: 1, name: 'Xiao Yiqiang' },
    { id: 2, school_id: 1, name: 'Yin Shi' },
    { id: 3, school_id: 1, name: 'LIN SHEN' },
    { id: 4, school_id: 1, name: 'XIE XUAN' },
    { id: 5, school_id: 1, name: 'SHA LEWEI' },
    { id: 6, school_id: 1, name: 'WANG YIHAN' },
    { id: 7, school_id: 1, name: 'WU SHUOZHEN' },
    { id: 8, school_id: 1, name: 'HU XIAORAN' },
    { id: 9, school_id: 2, name: 'HSU YU-LIANG' },
    { id: 10, school_id: 2, name: 'YU PIN' },
    { id: 11, school_id: 2, name: 'LIU KAIYAN' },
    { id: 12, school_id: 2, name: 'HUNG YUNGCHING' },
    { id: 13, school_id: 2, name: 'CHEN YUN-CHI' },
    { id: 14, school_id: 2, name: 'LEE TING-JIA' },
    { id: 15, school_id: 2, name: 'WU PEIHSUAN' },
    { id: 16, school_id: 2, name: 'HSIAO JUNG' },
    { id: 17, school_id: 2, name: 'LEE PIN-YI' },
    { id: 18, school_id: 2, name: 'WANG PENGCHIEH' },
    { id: 19, school_id: 2, name: 'LEE YUNGHSUAN' },
    { id: 20, school_id: 2, name: 'KE YEN-HSUN' },
    { id: 21, school_id: 2, name: 'CHU LEKHANG' },
    { id: 22, school_id: 3, name: 'SHILPA ARVINDBHAI MEVADA' },
    { id: 23, school_id: 3, name: 'Kavya Nanavati' },
    { id: 24, school_id: 3, name: 'Diya Jain' },
    { id: 25, school_id: 3, name: 'Nisharg Patel' },
    { id: 26, school_id: 3, name: 'Jayeetaa Mehta' },
    { id: 27, school_id: 4, name: 'Mochamad Donny Koerniawan' },
    { id: 28, school_id: 4, name: 'Putranto Sandy' },
    { id: 29, school_id: 4, name: 'Fernando Cunnoris' },
    { id: 30, school_id: 4, name: 'Ridhwan Miftahul Falah' },
    { id: 31, school_id: 4, name: 'Evan Nico Kristanto' },
    { id: 32, school_id: 4, name: 'Ade Suci Rahmadona' },
    { id: 33, school_id: 4, name: 'Mohamad Rafsanjani' },
    { id: 34, school_id: 4, name: 'Virginia Putri Riani' },
    { id: 35, school_id: 4, name: 'Hoseo Viadolorosa' },
    { id: 36, school_id: 4, name: 'Avip Iqbal Maulana' },
    { id: 37, school_id: 4, name: 'Safira Nur Kholifah' },
    { id: 38, school_id: 4, name: 'Jechika Millenia Gareso' },
    { id: 39, school_id: 4, name: 'Al Garton Mourzade Herawanto' },
    { id: 40, school_id: 4, name: 'Bryan Lebang' },
    { id: 41, school_id: 4, name: 'Muhammad Rafli' },
    { id: 42, school_id: 4, name: 'Ardian Farizi' },
    { id: 43, school_id: 4, name: 'Hilmy Allamsyah' },
    { id: 44, school_id: 4, name: 'Michaelangelo Zennino Octova Adrianantha Nugraha' },
    { id: 45, school_id: 4, name: 'khelmi mubarok' },
    { id: 46, school_id: 4, name: 'Juan Serius Lomboe' },
    { id: 47, school_id: 5, name: 'Martin Schoch' },
    { id: 48, school_id: 5, name: 'Yada nako' },
    { id: 49, school_id: 5, name: 'NAY WIN AUNG' },
    { id: 50, school_id: 5, name: 'Paphavarin Karnchanabatr' },
    { id: 51, school_id: 5, name: 'Purinee Donchai' },
    { id: 52, school_id: 5, name: 'Gun Cheenglab' },
    { id: 53, school_id: 5, name: 'Krittin Tanjariyaporn' },
    { id: 54, school_id: 5, name: 'Zaw Linn Naing' },
    { id: 55, school_id: 5, name: 'Min Khant Kyaw' },
    { id: 56, school_id: 5, name: 'han win soe' },
    { id: 57, school_id: 5, name: 'Tan Si Xuan' },
    { id: 58, school_id: 6, name: 'Jennifer Vibar' },
    { id: 59, school_id: 6, name: 'Aile Heydee Reolope' },
    { id: 60, school_id: 6, name: 'ASHLEY RICA GONZALES' },
    { id: 61, school_id: 7, name: 'Owen Rose' },
    { id: 62, school_id: 7, name: 'Boladji Gloria Elvire Zomahoun' },
    { id: 63, school_id: 7, name: 'Tuong-Vi Desjardins' },
    { id: 64, school_id: 7, name: 'Anaïs Catrinel Arhire' },
    { id: 65, school_id: 7, name: 'Sarah Boisvert' },
    { id: 66, school_id: 7, name: 'Amira Messeguem' },
    { id: 67, school_id: 7, name: 'Emma Soare' },
    { id: 68, school_id: 7, name: 'Yassir Koutroub' },
    { id: 69, school_id: 7, name: 'Carl Picard' },
    { id: 70, school_id: 7, name: 'Flavie Pelletier' },
    { id: 71, school_id: 8, name: 'Rodolfo Manuel Barragan Delgado' },
    { id: 72, school_id: 8, name: 'Roberto García Rosales' },
    { id: 73, school_id: 8, name: 'Angela Daniela Garza Davila' },
    { id: 74, school_id: 8, name: 'Elizabeth Wendy Argüello García' },
    { id: 75, school_id: 8, name: 'Andrea Valdés José' },
    { id: 76, school_id: 8, name: 'Ruth Molano Rivera' },
    { id: 77, school_id: 8, name: 'Victoria González Perea' },
    { id: 78, school_id: 8, name: 'Alejandro Zamarron' },
    { id: 79, school_id: 8, name: 'Juan Pablo Méndez Lomelí' },
    { id: 80, school_id: 8, name: 'Ana Isabel Hernández López' },
    { id: 81, school_id: 8, name: 'Arantza Salazar Fentanes' },
    { id: 82, school_id: 8, name: 'Katherin Duarte López' },
    { id: 83, school_id: 8, name: 'Angela Daniela Garza Dávila' },
    { id: 84, school_id: 8, name: 'Mariana Ledezma Ramirez' },
    { id: 85, school_id: 8, name: 'Ana Carolina Ziga Edgar' },
    { id: 86, school_id: 8, name: 'Humberto Murillo' },
    { id: 87, school_id: 8, name: 'Jaqueline Barrientos Flores' },
    { id: 88, school_id: 8, name: 'Regina Mariel Saldaña Herrera' },
    { id: 89, school_id: 8, name: 'Mariana Franco San Miguel' },
    { id: 90, school_id: 8, name: 'Martha Ortega' },
    { id: 91, school_id: 8, name: 'Hasiel Contreras' },
    { id: 92, school_id: 8, name: 'Alejandra Gonzalez Victoria' },
    { id: 93, school_id: 8, name: 'Roberta Sigala' },
    { id: 94, school_id: 8, name: 'Cynthia Coral Hernandez Vargas' },
    { id: 95, school_id: 8, name: 'Valeria Navarro Palma' },
    { id: 96, school_id: 8, name: 'Jessica Navarro Muñoz' },
    { id: 97, school_id: 8, name: 'Arturo Manuel Gómez Díaz' },
    { id: 98, school_id: 9, name: 'Yiqian Benjamin Jia' },
    { id: 99, school_id: 9, name: 'ming yang' },
    { id: 100, school_id: 9, name: 'Iman Al Deiri' },
    { id: 101, school_id: 9, name: 'Laura Kohlstadt' },
    { id: 102, school_id: 9, name: 'Anastasia Luna Seel' },
    { id: 103, school_id: 9, name: 'Saliha Hachimoglou' },
    { id: 104, school_id: 9, name: 'Nayanda Amarasriwasiti' },
    { id: 105, school_id: 9, name: 'Alexandra Natasha Alfian' },
    { id: 106, school_id: 9, name: 'Kartikeya Bagewadi' },
    { id: 107, school_id: 9, name: 'Larissa Christine Herbert' },
    { id: 108, school_id: 10, name: 'Ian Nazareth' },
    { id: 109, school_id: 10, name: 'Hussain Asghar' },
    { id: 110, school_id: 10, name: 'Anise Bonavita' },
    { id: 111, school_id: 10, name: 'Nitika Dileep' },
    { id: 112, school_id: 11, name: 'NAYNA TABASSUM' },
    { id: 113, school_id: 11, name: 'MD. MUKTADIR RAHMAN' },
    { id: 114, school_id: 11, name: 'FOUZIA MASUD MOURI' },
    { id: 115, school_id: 11, name: 'MD RIDWAN MUSTAQIM BIN AZAD' },
    { id: 116, school_id: 11, name: 'RAISA TAHSIN' },
    { id: 117, school_id: 11, name: 'MINHAZUL ISLAM' },
    { id: 118, school_id: 11, name: 'MEHLAIL EHSAN' },
    { id: 119, school_id: 11, name: 'BIJOY BHATTACHARJEE' },
    { id: 120, school_id: 11, name: 'ANGSHUMAN CHAKRABORTY' },
    { id: 121, school_id: 11, name: 'SALMA SADIA' },
    { id: 122, school_id: 11, name: 'SAIFUL ISLAM TUSHER' },
    { id: 123, school_id: 11, name: 'DHARANI SHASHI' },
    { id: 124, school_id: 11, name: 'SAMIHA ANIKA' },
    { id: 125, school_id: 11, name: 'URBA RIAZI' },
    { id: 126, school_id: 11, name: 'JANNATUL ADNIN' },
    { id: 127, school_id: 11, name: 'PUSHPITA DEY' },
    { id: 128, school_id: 11, name: 'MYSHA FYRUZ' },
    { id: 129, school_id: 11, name: 'SAMIA MEHNAZ MALIHA' },
    { id: 130, school_id: 11, name: 'FATEH UL ISLAM' },
    { id: 131, school_id: 11, name: 'AKIB AHMED' },
    { id: 132, school_id: 11, name: 'ASMA SADIA RAIMA' },
    { id: 133, school_id: 11, name: 'SAMIHA TANJIM' },
    { id: 134, school_id: 11, name: 'MARIA MEHNAZ' },
    { id: 135, school_id: 11, name: 'TASFIA TAZRIN' },
    { id: 136, school_id: 11, name: 'SUMAIYA BINTA TOFAYEL' },
    { id: 137, school_id: 11, name: 'AZIZUL HOQUE KHAN' },
    { id: 138, school_id: 11, name: 'NEHAR MEHJABIN SOCHCHHO' },
    { id: 139, school_id: 11, name: 'TANVIR CHOWDHURY' },
  ],
  submissions: [],
  next_school_id: 12,
  next_student_id: 140,
  next_submission_id: 1,
}

function load(): Database {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2), 'utf-8')
    return JSON.parse(JSON.stringify(SEED))
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as Database
}

function save(db: Database): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8')
}

let _db: Database | null = null

function getDB(): Database {
  if (!_db) _db = load()
  return _db
}

export interface DataStore {
  getSchools(): Promise<School[]>
  getStudentsBySchool(schoolId: number): Promise<Student[]>
  getAllSubmissions(): Promise<Submission[]>
  getSchoolById(id: number): Promise<School | undefined>
  addSubmission(input: {
    school_id: number
    visit_student_ids: number[]
    field_trip_student_ids: number[]
    extra_participant_names?: string[]
  }): Promise<Submission>
}

const jsonDb: DataStore = {
  async getSchools(): Promise<School[]> {
    return getDB().schools
  },
  async getStudentsBySchool(schoolId: number): Promise<Student[]> {
    return getDB().students.filter((s) => s.school_id === schoolId)
  },
  async getAllSubmissions(): Promise<Submission[]> {
    return getDB().submissions
  },
  async getSchoolById(id: number): Promise<School | undefined> {
    return getDB().schools.find((s) => s.id === id)
  },
  async addSubmission(input: {
    school_id: number
    visit_student_ids: number[]
    field_trip_student_ids: number[]
    extra_participant_names?: string[]
  }): Promise<Submission> {
    const data = getDB()
    const submission: Submission = {
      id: data.next_submission_id++,
      school_id: input.school_id,
      visit_student_ids: input.visit_student_ids,
      field_trip_student_ids: input.field_trip_student_ids,
      extra_participant_names: input.extra_participant_names,
      submitted_at: new Date().toISOString(),
    }
    data.submissions.push(submission)
    save(data)
    return submission
  },
}

function toNumberArray(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(Number) : []
    } catch {
      return []
    }
  }
  return []
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

function toIsoString(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return new Date(value).toISOString()
  return new Date().toISOString()
}

function rowToSubmission(row: Record<string, unknown>): Submission {
  return {
    id: Number(row.id),
    school_id: Number(row.school_id),
    visit_student_ids: toNumberArray(row.visit_student_ids),
    field_trip_student_ids: toNumberArray(row.field_trip_student_ids),
    extra_participant_names: toStringArray(row.extra_participant_names),
    submitted_at: toIsoString(row.submitted_at),
  }
}

function createPostgresDb(): DataStore {
  const ssl =
    process.env.PGSSLMODE === 'require' || process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX ?? 5),
    ssl,
  })

  let ready: Promise<void> | null = null

  async function ensureReady(): Promise<void> {
    if (ready) return ready
    ready = (async () => {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(`
          CREATE TABLE IF NOT EXISTS schools (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
          )
        `)
        await client.query(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            school_id INTEGER NOT NULL REFERENCES schools(id),
            name TEXT NOT NULL
          )
        `)
        await client.query(`
          CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            school_id INTEGER NOT NULL REFERENCES schools(id),
            visit_student_ids JSONB NOT NULL,
            field_trip_student_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
            extra_participant_names JSONB NOT NULL DEFAULT '[]'::jsonb,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )
        `)

        for (const school of SEED.schools) {
          await client.query(
            `INSERT INTO schools (id, name)
             VALUES ($1, $2)
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
            [school.id, school.name],
          )
        }

        for (const student of SEED.students) {
          await client.query(
            `INSERT INTO students (id, school_id, name)
             VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE
             SET school_id = EXCLUDED.school_id, name = EXCLUDED.name`,
            [student.id, student.school_id, student.name],
          )
        }

        const { rows } = await client.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM submissions')
        if (Number(rows[0]?.count ?? 0) === 0 && fs.existsSync(DATA_FILE)) {
          const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Database
          for (const submission of existing.submissions ?? []) {
            await client.query(
              `INSERT INTO submissions (
                id,
                school_id,
                visit_student_ids,
                field_trip_student_ids,
                extra_participant_names,
                submitted_at
              )
              VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6)
              ON CONFLICT (id) DO NOTHING`,
              [
                submission.id,
                submission.school_id,
                JSON.stringify(submission.visit_student_ids ?? []),
                JSON.stringify(submission.field_trip_student_ids ?? []),
                JSON.stringify(submission.extra_participant_names ?? []),
                submission.submitted_at,
              ],
            )
          }
        }

        await client.query(`
          SELECT setval(
            pg_get_serial_sequence('submissions', 'id'),
            COALESCE((SELECT MAX(id) FROM submissions), 1),
            (SELECT COUNT(*) > 0 FROM submissions)
          )
        `)
        await client.query('COMMIT')
        console.log('PostgreSQL storage ready')
      } catch (error) {
        await client.query('ROLLBACK')
        ready = null
        throw error
      } finally {
        client.release()
      }
    })()
    return ready
  }

  return {
    async getSchools(): Promise<School[]> {
      await ensureReady()
      const { rows } = await pool.query<School>('SELECT id, name FROM schools ORDER BY id ASC')
      return rows
    },

    async getStudentsBySchool(schoolId: number): Promise<Student[]> {
      await ensureReady()
      const { rows } = await pool.query<Student>(
        'SELECT id, school_id, name FROM students WHERE school_id = $1 ORDER BY id ASC',
        [schoolId],
      )
      return rows
    },

    async getAllSubmissions(): Promise<Submission[]> {
      await ensureReady()
      const { rows } = await pool.query<Record<string, unknown>>(
        `SELECT id, school_id, visit_student_ids, field_trip_student_ids, extra_participant_names, submitted_at
         FROM submissions
         ORDER BY id ASC`,
      )
      return rows.map(rowToSubmission)
    },

    async getSchoolById(id: number): Promise<School | undefined> {
      await ensureReady()
      const { rows } = await pool.query<School>(
        'SELECT id, name FROM schools WHERE id = $1',
        [id],
      )
      return rows[0]
    },

    async addSubmission(input): Promise<Submission> {
      await ensureReady()
      const { rows } = await pool.query<Record<string, unknown>>(
        `INSERT INTO submissions (
          school_id,
          visit_student_ids,
          field_trip_student_ids,
          extra_participant_names
        )
        VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)
        RETURNING id, school_id, visit_student_ids, field_trip_student_ids, extra_participant_names, submitted_at`,
        [
          input.school_id,
          JSON.stringify(input.visit_student_ids ?? []),
          JSON.stringify(input.field_trip_student_ids ?? []),
          JSON.stringify(input.extra_participant_names ?? []),
        ],
      )
      return rowToSubmission(rows[0])
    },
  }
}

export const db: DataStore = process.env.DATABASE_URL ? createPostgresDb() : jsonDb
