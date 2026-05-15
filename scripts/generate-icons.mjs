/**
 * Generates minimal valid PNG icons for PWA (192x192 and 512x512).
 * Uses only Node.js built-ins (zlib). No external dependencies.
 * Colors: dark navy background (#0f172a) with blue accent circle (#3b82f6).
 */
import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4)
  len.writeUInt32BE(data.length)
  const payload = Buffer.concat([t, data])
  const crc = Buffer.allocUnsafe(4)
  crc.writeUInt32BE(crc32(payload))
  return Buffer.concat([len, payload, crc])
}

function makePNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0

  // Background: #0f172a → r=15 g=23 b=42
  // Circle: #3b82f6 → r=59 g=130 b=246
  const bgR = 15, bgG = 23, bgB = 42
  const acR = 59, acG = 130, acB = 246

  const cx = size / 2, cy = size / 2
  const r = size * 0.38

  const rowLen = 1 + size * 3
  const raw = Buffer.allocUnsafe(size * rowLen)

  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const [rr, gg, bb] = dist <= r ? [acR, acG, acB] : [bgR, bgG, bgB]
      const off = y * rowLen + 1 + x * 3
      raw[off] = rr; raw[off + 1] = gg; raw[off + 2] = bb
    }
  }

  const idat = deflateSync(raw)
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', makePNG(192))
writeFileSync('public/icons/icon-512.png', makePNG(512))
console.log('✓ public/icons/icon-192.png')
console.log('✓ public/icons/icon-512.png')
