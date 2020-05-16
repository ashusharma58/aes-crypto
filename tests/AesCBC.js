'use strict'

import crypto from 'crypto'
import { Aes, AesUtils } from '../src'

const aesOptions = {
  ivFormat: 'hex',
  keyFormat: 'hex',
  cipherTextFormat: 'base64'
}
const aesOptionsWihtKDF = {
  ivFormat: 'hex',
  keyFormat: 'hex',
  cipherTextFormat: 'base64',
  deriveKey: true,
  dataSeparator: ''
}
const data = '{"expiry":"0525","cardNumber":"4095420013009061"}'
const iv = '00000000000000000000000000000000'
const masterKey = 'LEAP0617946ce06208011ea0bf9f00a0900e0000'
const key16 = '66378C5EF5A75F64889FABD1D31A54A7'
const key32 = '66378C5EF5A75F64889FABD1D31A54A792430DD46B3476D1027A9ED3EA6ACAFE'

// Test Aes-128-CBC ////////////////////////////////////////////////////////////
console.log('\n\nTesting Aes-128-CBC...')
console.log('data:', data)
console.log('key16:', key16)

const aes128CbcCipherTextParams = { data, key: key16 }
const aes128CbcEncryptedData = Aes.encrypt('aes-128-cbc', aes128CbcCipherTextParams, aesOptions)
const { payload: aes128CbcCipherText } = aes128CbcEncryptedData
console.log('aes128CbcEncryptedData:', aes128CbcEncryptedData)

const aes128CbcPlainTextParams = { payload: aes128CbcCipherText, key: key16 }
const aes128CbcPlainText = Aes.decrypt('aes-128-cbc', aes128CbcPlainTextParams, aesOptions)
console.log('aes128CbcPlainText:', aes128CbcPlainText)

if (aes128CbcPlainText.data === data) {
  console.log('Aes-128-CBC Test Passed!')
} else {
  console.log('Aes-128-CBC Test Failed!')
}
/// /////////////////////////////////////////////////////////////////////////////

// Test Aes-128-CBC with KDF ///////////////////////////////////////////////////
console.log('\n\nTesting Aes-128-CBC with KDF...')
console.log('data:', data)
console.log('masterKey:', masterKey)
const aes128CbcWithKDFCipherTextParams = { data, masterKey }
const aes128CbcWithKDFEncryptedData = Aes.encrypt('aes-128-cbc', aes128CbcWithKDFCipherTextParams, aesOptionsWihtKDF)
const { payload: aes128CbcWithKDFCipherText } = aes128CbcWithKDFEncryptedData
console.log('aes128CbcWithKDFEncryptedData:', aes128CbcWithKDFEncryptedData)

const aes128CbcWithKDFPlainTextParams = { payload: aes128CbcWithKDFCipherText, masterKey, iv }
const aes128CbcWithKDFPlainText = Aes.decrypt('aes-128-cbc', aes128CbcWithKDFPlainTextParams, aesOptionsWihtKDF)
console.log('aes128CbcWithKDFPlainText:', aes128CbcWithKDFPlainText)

if (aes128CbcWithKDFPlainText.data === data) {
  console.log('Aes-128-CBC with KDF Test Passed!')
} else {
  console.log('Aes-128-CBC with KDF Test Failed!')
}
/// /////////////////////////////////////////////////////////////////////////////

// // Test Aes-256-CBC ////////////////////////////////////////////////////////////
console.log('\n\nTesting Aes-256-CBC...')
console.log('data:', data)
console.log('key32:', key32)

const aes256CbcCipherTextParams = { data, key: key32, iv }
const aes256CbcEncryptedData = Aes.encrypt('aes-256-cbc', aes256CbcCipherTextParams, aesOptions)
const { payload: aes256CbcCipherText } = aes256CbcEncryptedData
console.log('aes256CbcEncryptedData:', aes256CbcEncryptedData)

const aes256CbcPlainTextParams = { payload: aes256CbcCipherText, key: key32 }
const aes256CbcPlainText = Aes.decrypt('aes-256-cbc', aes256CbcPlainTextParams, aesOptions)
console.log('aes256CbcPlainText:', aes256CbcPlainText)

if (aes256CbcPlainText.data === data) {
  console.log('Aes-256-CBC Test Passed!')
} else {
  console.log('Aes-256-CBC Test Failed!')
}
// ////////////////////////////////////////////////////////////////////////////////

// // Test Aes-256-CBC with KDF ///////////////////////////////////////////////////
console.log('\n\nTesting Aes-256-CBC with KDF...')
console.log('data:', data)
console.log('masterKey:', masterKey)
const aes256CbcWithKDFCipherTextParams = { data, masterKey }
const aes256CbcWithKDFEncryptedData = Aes.encrypt('aes-256-cbc', aes256CbcWithKDFCipherTextParams, aesOptionsWihtKDF)
const { payload: aes256CbcWithKDFCipherText } = aes256CbcWithKDFEncryptedData
console.log('aes256CbcWithKDFEncryptedData:', aes256CbcWithKDFEncryptedData)

const aes256CbcWithKDFPlainTextParams = { payload: aes256CbcWithKDFCipherText, masterKey, iv }
const aes256CbcWithKDFPlainText = Aes.decrypt('aes-256-cbc', aes256CbcWithKDFPlainTextParams, aesOptionsWihtKDF)
console.log('aes256CbcWithKDFPlainText:', aes256CbcWithKDFPlainText)

if (aes256CbcWithKDFPlainText.data === data) {
  console.log('Aes-256-CBC with KDF Test Passed!')
} else {
  console.log('Aes-256-CBC with KDF Test Failed!')
}
// ////////////////////////////////////////////////////////////////////////////////
