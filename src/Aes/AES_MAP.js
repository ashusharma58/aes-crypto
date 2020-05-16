'use strict'

import AesCBC from './AesCBC'
import AesGCM from './AesGCM'

const { ALGORITHMS: CBC_ALGORITHM } = AesCBC
const { ALGORITHMS: GCM_ALGORITHM } = AesGCM

const ALGORITHMS = {}

CBC_ALGORITHM.forEach(algorithm => { ALGORITHMS[algorithm] = AesCBC })
GCM_ALGORITHM.forEach(algorithm => { ALGORITHMS[algorithm] = AesGCM })

export { ALGORITHMS }
