'use strict'

import { cryptoHelper } from '../src'

// Test generateKey ////////////////////////////////////////////////////////////
console.log('\n\nTesting cryptoHelper.generateKey...')
const keyBufferLength = 32
const keyFormat = 'hex'
const masterKey = 'McQfTjWnZq4t7w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9y$B&E'

const kdf = 'PBKDF2'
const kdfIterations = 50
const kdfDigest = 'sha256'

const keyWithoutKdfParams = { keyBufferLength, keyFormat }
const keyWithoutKdf = cryptoHelper.generateKey(keyWithoutKdfParams)
console.log('keyWithoutKdf:', keyWithoutKdf);

const keyWithKdfParams = { masterKey, keyBufferLength, keyFormat }
const keyWithKdfOptions = { kdf, kdfIterations, kdfDigest }
const keyWithKdf = cryptoHelper.generateKey(keyWithKdfParams, keyWithKdfOptions)
console.log('keyWithKdf:', keyWithKdf);
////////////////////////////////////////////////////////////////////////////////
