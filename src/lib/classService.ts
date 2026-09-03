import { supabase } from './supabaseClient';

export interface Class {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export const getClasses = async (): Promise<Class[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }

  return data || [];
};

export const getClassById = async (id: string): Promise<Class | undefined> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching class with id ${id}:`, error);
    return undefined;
  }

  return data;
};

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('role', 'teacher');

  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }

  return data || [];
};

export const getAssignedTeachers = async (classId: string): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('class_teachers')
    .select('teacher_id, profiles:teacher_id(id, name, email, role)')
    .eq('class_id', classId);

  if (error) {
    console.error(`Error fetching assigned teachers for class ${classId}:`, error);
    return [];
  }

  const teachers: Teacher[] = [];
  if (data) {
    data.forEach((row: any) => {
      if (row.profiles) {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        teachers.push({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role
        });
      }
    });
  }

  return teachers;
};

export const assignTeacherToClass = async (classId: string, teacherId: string): Promise<void> => {
  const { error } = await supabase
    .from('class_teachers')
    .insert({ class_id: classId, teacher_id: teacherId });

  if (error) {
    console.error(`Error assigning teacher ${teacherId} to class ${classId}:`, error);
    throw error;
  }
};

export const removeTeacherFromClass = async (classId: string, teacherId: string): Promise<void> => {
  const { error } = await supabase
    .from('class_teachers')
    .delete()
    .eq('class_id', classId)
    .eq('teacher_id', teacherId);

  if (error) {
    console.error(`Error removing teacher ${teacherId} from class ${classId}:`, error);
    throw error;
  }
};
