import { without } from 'lodash'
import { WorldNode, WorldTree, Location, Creature } from './worldtree'

export const world = new WorldTree()

export function defineLocation(params: {
  name: string
  description: string
  where?: Location
}): Location {
  const location = new Location(world, params)
  location.move(params.where)
  return location
}

export function defineCreature(params: {
  name: string
  description: string
  where: Location
}): Creature {
  const creature = new Creature(world, params)
  creature.move(params.where)
  return creature
}

export const global = defineLocation({
  name: 'global',
  description: 'Container for the entire world.',
})

world.root = global

const town = defineLocation({
  name: 'town',
  description:
    'Before the cataclysm, this was a moderately sized town of a few thousand. Like most, the people of this town did not survive the events. Like most, the dead did not remain so. Now the place is dangerous to anyone who survived. The supplies that can be found here are vital to the survival of the nearby settlement, but only the most foolhardy dare to venture here to scavenge the ruins of the dead.',
  where: global,
})

const shelter = defineLocation({
  name: 'shelter',
  description:
    'A lone house with a sturdy basement. Far enough out in the boons that it allowed you to survive the cataclysm. Your food is running out, however, and you will have to venture out into the world if you wish to survive.',
  where: global,
})

const player = defineCreature({
  name: 'player',
  description: 'This is you, and you are this.',
  where: shelter,
})

export function where(): void {
  const playerLocation = world.getParent(player) as Location
  console.log(
    `You are here: ${playerLocation.name} - ${
      playerLocation.description
    }\n${describeLocationString(playerLocation, player)}`
  )
}

export function describeLocationString(
  location: Location,
  self: Creature
): string {
  const descriptions = (
    without(location.children, self).filter(
      child => child.type === 'CREATURE'
    ) as Creature[]
  ).map(creature => `${creature.name}: ${creature.description}`)

  return descriptions.map(description => `- ${description}`).join('\n')
}

export function moveList(): WorldNode[] {
  const children = player.parent.children
  const parent = player.parent.parent
  const neighbours = without(player.parent.parent.children, player.parent)
  return [parent, ...children, ...neighbours].filter(
    item => item.type === 'LOCATION'
  )
}

export function printMoveList(): void {
  console.log('From here you can move to:')
  for (const location of moveList()) {
    console.log('-', location.name)
  }
}

export function move(target: string) {
  const possibleTargets = moveList()

  const moveTo = possibleTargets.find(item => item.name === target)!
  world.move(player, moveTo)
}
