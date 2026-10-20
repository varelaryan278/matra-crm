"use client"

import { useCallback, useRef, useState } from "react"
import { seedEvents, seedFiles, seedTasks } from "./mock/activity"
import { currentUser } from "./mock/team"
import { localNowIso } from "./format"
import type { LeadEvent, LeadEventType, LeadFile, LeadTask } from "./mock/types"

export const useLeadActivity = () => {
  const [events, setEvents] = useState<LeadEvent[]>(seedEvents)
  const [files, setFiles] = useState<LeadFile[]>(seedFiles)
  const [tasks, setTasks] = useState<LeadTask[]>(seedTasks)
  const seq = useRef(0)

  const logEvent = useCallback((leadId: string, type: LeadEventType, text: string, authorId: string | undefined = currentUser.id) => {
    setEvents((prev) => [...prev, { id: `ev-n${++seq.current}`, leadId, type, text, authorId, at: localNowIso() }])
  }, [])

  const addEvents = useCallback((list: LeadEvent[]) => setEvents((prev) => [...prev, ...list]), [])

  const addComment = (leadId: string, text: string) => logEvent(leadId, "comment", text)

  const addFiles = (leadId: string, list: { name: string; size: number }[]) => {
    const at = localNowIso()
    setFiles((prev) => [...list.map((f) => ({ ...f, id: `f-n${++seq.current}`, leadId, at, authorId: currentUser.id })), ...prev])
    list.forEach((f) => logEvent(leadId, "file", `Arquivo anexado: ${f.name}`))
  }

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id)
    if (!file) return
    setFiles((prev) => prev.filter((f) => f.id !== id))
    logEvent(file.leadId, "file", `Arquivo removido: ${file.name}`)
  }

  const addTask = (leadId: string, title: string, due: string, ownerId: string) => {
    setTasks((prev) => [...prev, { id: `t-n${++seq.current}`, leadId, title, due, done: false, ownerId }])
    logEvent(leadId, "task", `Tarefa criada: ${title}`)
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    logEvent(task.leadId, "task", `${task.done ? "Tarefa reaberta" : "Tarefa concluída"}: ${task.title}`)
  }

  return { events, files, tasks, logEvent, addEvents, addComment, addFiles, removeFile, addTask, toggleTask }
}
