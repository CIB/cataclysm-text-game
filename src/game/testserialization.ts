import './settlement'
import { world } from './game'
import { WorldTree } from './worldtree'

const serialized = world.serialize()
console.log('serialized', serialized)
const world2 = WorldTree.fromJSON(serialized)
console.log('world2', world2)
