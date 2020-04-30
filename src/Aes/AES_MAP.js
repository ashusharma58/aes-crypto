'use strict'

import AesCBC from './AesCBC'
import AesGCM from './AesGCM'

const { ALGORITHMS: CBC_ALGORITHM } = AesCBC
const { ALGORITHMS: GCM_ALGORITHM } = AesGCM

const ALGORITHM = {}

CBC_ALGORITHM.forEach(algorithm => ALGORITHM[algorithm] = AesCBC)
GCM_ALGORITHM.forEach(algorithm => ALGORITHM[algorithm] = AesGCM)

export { ALGORITHM }
