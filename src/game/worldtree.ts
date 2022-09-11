import { Dictionary, flatMap, fromPairs, values } from 'lodash'
import { v4 } from 'uuid'
import { world } from './game'
import { deserialize, deserializer, ISerializable } from './serializable'

export interface EntityHandlers {
  name: (item: WorldNode) => string
  description: (item: WorldNode) => string
}

export const entityHandlers: Dictionary<EntityHandlers> = {}

export abstract class WorldNode implements ISerializable {
  type: string = ''
  id: string = v4()

  constructor(private world: WorldTree) {
    world.add(this)
  }

  serialize(): Dictionary<unknown> {
    return {
      type: this.type,
      id: this.id,
    }
  }

  move(where?: WorldNode): void {
    if (where) {
      this.world.move(this, where)
    }
  }

  get parent(): WorldNode {
    return this.world.getParent(this)
  }

  get children(): WorldNode[] {
    return this.world.getChildren(this)
  }

  abstract get name(): string
  abstract get description(): string
}

export class Location extends WorldNode {
  type = 'LOCATION'
  name: string
  description: string

  constructor(
    world: WorldTree,
    params: { name: string; description: string; where?: Location }
  ) {
    super(world)
    this.name = params.name
    this.description = params.description
  }

  serialize(): Dictionary<unknown> {
    return {
      ...super.serialize(),
      name: this.name,
      description: this.description,
    }
  }
}

deserializer(
  'LOCATION',
  (world, json) =>
    new Location(world, {
      name: json.name as string,
      description: json.description as string,
    })
)

export class Creature extends WorldNode {
  type = 'CREATURE'
  name: string
  description: string

  constructor(
    world: WorldTree,
    params: { name: string; description: string; where?: Location }
  ) {
    super(world)
    this.name = params.name
    this.description = params.description
  }

  serialize(): Dictionary<unknown> {
    return {
      ...super.serialize(),
      name: this.name,
      description: this.description,
    }
  }
}

deserializer(
  'CREATURE',
  (world, json) =>
    new Creature(world, {
      name: json.name as string,
      description: json.description as string,
    })
)

export type SerializedNode = Dictionary<unknown>

interface SerializedWorldTree {
  nodes: SerializedNode[]
  children: Dictionary<string[]>
  parents: Dictionary<string>
  root: string
}

export class WorldTree {
  nodes: Dictionary<WorldNode> = {}
  children: Dictionary<string[]> = {}
  parents: Dictionary<string> = {}

  root!: WorldNode

  add(node: WorldNode) {
    this.nodes[node.id] = node
  }

  move(node: WorldNode, parent: WorldNode): void {
    const oldParent = this.parents[node.id]
    if (oldParent) {
      this.children[oldParent] = this.children[oldParent].filter(
        item => item !== node.id
      )
    }
    this.parents[node.id] = parent.id
    if (this.children[parent.id]) {
      this.children[parent.id].push(node.id)
    } else {
      this.children[parent.id] = [node.id]
    }
  }

  getParent(node: WorldNode): WorldNode {
    return this.nodes[this.parents[node.id]]
  }

  getChildren(node: WorldNode): WorldNode[] {
    return this.children[node.id].map(id => this.nodes[id])
  }

  getChild(node: WorldNode, name: string): WorldNode {
    const children = this.getChildren(node)
    return children.find(child => child.name === name)!
  }

  topDown(node: WorldNode): WorldNode[] {
    return [node, ...flatMap(node.children, item => this.topDown(item))]
  }

  serialize(): SerializedWorldTree {
    return {
      nodes: values(this.nodes).map(node => node.serialize()),
      children: this.children,
      parents: this.parents,
      root: this.root.id,
    }
  }

  static fromJSON(json: SerializedWorldTree): WorldTree {
    const value = new WorldTree()

    function deserializeNode(json: SerializedNode): WorldNode {
      const result = deserialize(value, json) as WorldNode
      result.id = json.id as string
      return result
    }

    value.nodes = fromPairs(
      json.nodes.map(node => [node.id, deserializeNode(node)])
    )
    value.parents = json.parents
    value.children = json.children
    value.root = values(value.nodes).find(node => node.id === json.root)!
    return value
  }
}
