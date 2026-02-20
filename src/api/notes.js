import { supabase } from '../supabase/client'

// Create note
export async function createNote({ course, title, content }) {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        course,
        title,
        content,
        upvotes: 0,
        downvotes: 0
      }
    ])
    .select()

  return { data, error }
}

// Fetch all notes
export async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('upvotes', { ascending: false })

  return { data, error }
}

// Vote on a note
export async function voteNote(note, type) {
  const updated =
    type === 'up'
      ? { upvotes: note.upvotes + 1 }
      : { downvotes: note.downvotes + 1 }

  const { data, error } = await supabase
    .from('notes')
    .update(updated)
    .eq('id', note.id)

  return { data, error }
}