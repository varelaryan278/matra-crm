import { branchingKinds, nodeDefaults } from "./node-defaults"
import type { Flow, FlowNode, NodeKind } from "@/lib/mock/types"

export type Slot = "next" | "yes" | "no"

export type NodeSpec = { kind: NodeKind; config?: Record<string, string>; yes?: NodeSpec[]; no?: NodeSpec[] }

export const isBranching = (kind: NodeKind) => branchingKinds.includes(kind)

export const buildFlow = (prefix: string, specs: NodeSpec[]): Flow => {
  const nodes: Record<string, FlowNode> = {}
  let seq = 0
  const build = (list: NodeSpec[]): string | undefined => {
    const ids = list.map((spec) => {
      const id = `${prefix}-${seq++}`
      nodes[id] = { id, kind: spec.kind, config: { ...nodeDefaults[spec.kind], ...spec.config } }
      return id
    })
    list.forEach((spec, i) => {
      const node = nodes[ids[i]]
      if (isBranching(spec.kind)) {
        node.yes = build(spec.yes ?? [])
        node.no = build(spec.no ?? [])
      } else {
        node.next = ids[i + 1]
      }
    })
    return ids[0]
  }
  return { rootId: build(specs)!, nodes }
}

const findParent = (flow: Flow, id: string): { parent: FlowNode; slot: Slot } | undefined => {
  for (const node of Object.values(flow.nodes)) {
    if (node.next === id) return { parent: node, slot: "next" }
    if (node.yes === id) return { parent: node, slot: "yes" }
    if (node.no === id) return { parent: node, slot: "no" }
  }
}

const collect = (flow: Flow, id: string | undefined, acc: string[] = []) => {
  if (!id) return acc
  const node = flow.nodes[id]
  acc.push(id)
  collect(flow, node.next, acc)
  collect(flow, node.yes, acc)
  collect(flow, node.no, acc)
  return acc
}

export const insertNode = (flow: Flow, parentId: string, slot: Slot, kind: NodeKind, id: string): Flow => {
  const parent = flow.nodes[parentId]
  const child = parent[slot]
  const node: FlowNode = { id, kind, config: { ...nodeDefaults[kind] } }
  if (isBranching(kind)) node.yes = child
  else node.next = child
  return { ...flow, nodes: { ...flow.nodes, [id]: node, [parentId]: { ...parent, [slot]: id } } }
}

export const removeNode = (flow: Flow, id: string): Flow => {
  const found = findParent(flow, id)
  if (!found) return flow
  const node = flow.nodes[id]
  const keep = isBranching(node.kind) ? node.yes : node.next
  const drop = isBranching(node.kind) ? collect(flow, node.no) : []
  const nodes = { ...flow.nodes, [found.parent.id]: { ...found.parent, [found.slot]: keep } }
  delete nodes[id]
  drop.forEach((d) => delete nodes[d])
  return { ...flow, nodes }
}

export const updateConfig = (flow: Flow, id: string, key: string, value: string): Flow => ({
  ...flow,
  nodes: { ...flow.nodes, [id]: { ...flow.nodes[id], config: { ...flow.nodes[id].config, [key]: value } } },
})

export const countNodes = (flow: Flow) => Object.keys(flow.nodes).length

export const triggerOf = (flow: Flow) => flow.nodes[flow.rootId].config

export const mainPath = (flow: Flow, limit = 7) => {
  const path: FlowNode[] = []
  let id: string | undefined = flow.rootId
  while (id && path.length < limit) {
    const node: FlowNode = flow.nodes[id]
    path.push(node)
    id = node.next ?? node.yes
  }
  return path
}

export const countBranches = (flow: Flow) => Object.values(flow.nodes).filter((n) => isBranching(n.kind)).length
