import { Dictionary, keys } from 'lodash'
import { deserializer } from './serializable'
import { WorldNode, WorldTree, Location } from './worldtree'

export enum Material {
  'FOOD',
  'WATER',
  'STEEL',
  'PLASTIC',
}

export interface MaterialComposition {
  [key: string]: number
}

export class Item extends WorldNode {
  type = 'ITEM'
  itemType: string

  constructor(world: WorldTree, params: { itemType: string }) {
    super(world)
    this.itemType = params.itemType
  }

  serialize(): Dictionary<unknown> {
    return {
      ...super.serialize(),
      itemType: this.itemType,
    }
  }

  get template(): ItemTemplate {
    return itemTemplates[this.itemType]
  }

  get materials(): MaterialComposition {
    return this.template.materials
  }

  get name(): string {
    return this.template.name
  }

  get description(): string {
    return this.template.name
  }
}

deserializer(
  'ITEM',
  (world, json) =>
    new Item(world, {
      itemType: json.itemType as string,
    })
)

export interface ItemTemplate {
  name: string
  description: string
  materials: MaterialComposition
}

export const itemTemplates: Dictionary<ItemTemplate> = {}

export function combinedMaterials(items: Item[]) {
  return addMaterials(items.map(item => item.materials))
}

export function addMaterials(
  materials: MaterialComposition[]
): MaterialComposition {
  const result = {} as MaterialComposition
  for (const addMaterial of materials) {
    for (const material of keys(addMaterial)) {
      if (material in result) {
        result[material] += addMaterial[material]
      } else {
        result[material] = addMaterial[material]
      }
    }
  }
  return result
}

export function getItems(world: WorldTree, container: WorldNode): Item[] {
  return world
    .getChildren(container)
    .filter(item => item.type === 'ITEM') as Item[]
}

export function materialsInLocation(
  world: WorldTree,
  container: WorldNode
): MaterialComposition {
  const items = getItems(world, container)
  return combinedMaterials(items)
}
