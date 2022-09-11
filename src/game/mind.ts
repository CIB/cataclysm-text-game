/** The thoughts of a creature in the game */

import { WorldNode } from './worldtree'

export interface Attitude {
  like: number
  trust: number
  respect: number
}

interface RelationTuple {
  subject: WorldNode | string
  object: WorldNode | string
  verb: string
}

export class Thoughts implements ISerializable {}

export class Mind implements ISerializable {}
