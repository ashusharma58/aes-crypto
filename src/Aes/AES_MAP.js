'use strict'

import { Aes256GCM } from './Aes256GCM'
import { Aes256CBC } from './Aes256CBC'

export const ALGORITHM = {
  'aes-256-gcm': Aes256GCM,
  'aes-256-cbc': Aes256CBC
}
