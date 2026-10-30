export const LETTER_SUBJECTS = ['Pengumuman', 'Himbauan', 'Notulen Rapat', 'Pemberitahuan'] as const
export type LetterSubject = (typeof LETTER_SUBJECTS)[number]

export const UPLOAD_RULES = {
  pdf: {
    label: 'Surat (PDF)',
    mimeTypes: ['application/pdf'],
    extensions: ['pdf'],
    maxBytes: 5 * 1024 * 1024,
    accept: 'application/pdf,.pdf',
  },
  image: {
    label: 'Gambar (PNG/JPG/JPEG)',
    mimeTypes: ['image/png', 'image/jpeg'],
    extensions: ['png', 'jpg', 'jpeg'],
    maxBytes: 2 * 1024 * 1024,
    accept: 'image/png,image/jpeg,.png,.jpg,.jpeg',
  },
} as const

export type UploadKind = keyof typeof UPLOAD_RULES

export const MAX_BULLETIN_IMAGES = 2
