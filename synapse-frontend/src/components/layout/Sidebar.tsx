import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getClassrooms, createClassroom, deleteClassroom } from '../../api/classroomApi';
import CreateClassroomModal from '../../features/classrooms/CreateClassroomModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { Plus, BrainCircuit, LogOut, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { Classroom } from '../../types';
import ThemeToggle from '../ui/ThemeToggle';
export default function Sidebar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const logout = useAuthStore((state) => state.logout);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Classroom | null>(null);

  const { data: classrooms, isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: getClassrooms,
  });

  const createClassroomMutation = useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      setIsCreateModalOpen(false);
    },
  });

  // Derslik silmek için yeni mutation
  const deleteClassroomMutation = useMutation({
    mutationFn: deleteClassroom,
    onSuccess: (_data, deletedClassroomId) => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      setDeleteTarget(null);
      // Eğer silinen derslik o an görüntülenen derslik ise, ana sayfaya yönlendir
      if (classroomId && parseInt(classroomId) === deletedClassroomId) {
        navigate('/app');
      }
    },
  });

  const handleCreateClassroom = (name: string) => {
    createClassroomMutation.mutate({ name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteClassroomMutation.mutate(deleteTarget.id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-slate-900 text-gray-800 dark:text-white p-4 flex flex-col border-r border-gray-300 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="font-bold text-2xl flex items-center gap-2 text-gray-900 dark:text-white">
            <BrainCircuit className="text-sky-500 dark:text-sky-400" />
            Synapse
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 mb-2">Derslikler</p>
          <nav className="space-y-1">
            {isLoading && <div className="text-gray-400 px-2">Yükleniyor...</div>}
            {classrooms?.map((classroom) => (
              <div key={classroom.id} className="group relative flex items-center">
                <NavLink
                  to={`/app/classrooms/${classroom.id}`}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                         ? 'bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {classroom.name}
                </NavLink>
                <button
                  onClick={() => setDeleteTarget(classroom)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Dersliği Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Yeni Derslik
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClassroom}
        isCreating={createClassroomMutation.isPending}
      />
      
      <ConfirmationModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteClassroomMutation.isPending}
        title="Dersliği Sil"
        message={`'${deleteTarget?.name}' adlı dersliği ve içindeki tüm dokümanları kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />
    </>
  );
}
