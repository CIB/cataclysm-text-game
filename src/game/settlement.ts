import { world, global, defineLocation, defineCreature } from './game'
import { MaterialComposition, materialsInLocation } from './item'
import { WorldNode } from './worldtree'

export const settlement = defineLocation({
  name: 'settlement',
  description: `
    A small settlement of survivors of the cataclysm.

    Far enough from large population centers to grant them relative safety, but close enough to a lightly populated area to allow scavengers looting necessary supplies from the ruins.
  
    High, solid wooden walls surround a farmstead. The barn's ceiling has been patched and reinforced with wood.
    
    The living house has been extended with several wooden structures.
    
    A well tended garden stretches off one side of the house.

    A guard is stationed at the entrance to the settlement. Several more are patrolling the crop fields outside the walls.
  `,
  where: global,
})

export const barn = defineLocation({
  name: 'barn',
  description:
    'An old barn turned storage space. Supplies and materials are stacked high in large bins.',
  where: settlement,
})

export const wallEntrance = defineLocation({
  name: 'wall entrance',
  description:
    'A small opening in the construction of the wall. A thick wooden gate is hanging wide open.',
  where: settlement,
})

export const entranceGuard = defineCreature({
  name: 'entrance guard',
  description:
    'A short, burly man clad in woodsy leather. A shotgun with strap is slung over his shoulder, he holds a long wooden spear with a metal tip firmly in his hand.',
  where: wallEntrance,
})

export const counter = defineLocation({
  name: 'counter',
  description:
    'A counter littered with stacks of paper, clipboards, and office supplies. A man is resting his palms on the desk, patiently waiting for you to address him.',
  where: barn,
})

export function townMaterials(town: WorldNode): MaterialComposition {
  const barn = world.getChild(town, 'barn')
  return materialsInLocation(world, barn)
}
