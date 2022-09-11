import { Dictionary } from 'lodash'
import { WorldTree } from './worldtree'

export interface ISerializable {
  serialize(): Dictionary<unknown>
}

export function deserialize(
  world: WorldTree,
  json: Dictionary<unknown>
): ISerializable {
  const type = json.type as string
  return deserializeFunctions[type](world, json)
}

export type FnDeserialize = (
  world: WorldTree,
  json: Dictionary<unknown>
) => ISerializable

export const deserializeFunctions: Dictionary<FnDeserialize> = {}

export function deserializer(key: string, fn: FnDeserialize) {
  deserializeFunctions[key] = fn
}
