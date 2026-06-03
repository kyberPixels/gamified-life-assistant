import React, { useState } from 'react';
import '../styles/Quests.css';

interface Quest {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  is_completed: boolean;
}

const Quests: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, title: 'Popij 2L vode', description: 'Hidratacija je ključ uspjeha', xp_reward: 50, is_completed: false },
    { id: 2, title: 'Završi bazu podataka', description: 'Kreiraj tabele u phpMyAdminu', xp_reward: 150, is_completed: true },
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXp] = useState(50);

  const handleAddQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newQuest: Quest = {
      id: Date.now(),
      title,
      description,
      xp_reward: xp,
      is_completed: false,
    };

    setQuests([...quests, newQuest]);
    setTitle('');
    setDescription('');
  };

  const toggleQuest = (id: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, is_completed: !q.is_completed } : q));
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="quests-header">⚔️ Quest Log ⚔️</h2>
      
      {/* FORM TO ADD NEW QUEST */}
      <form onSubmit={handleAddQuest} className="quest-form">
        <h3>Create New Quest</h3>
        <div className="form-group">
          <label>Quest Title:</label>
          <input className="quest-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Study React" required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input className="quest-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What do you need to do?" />
        </div>
        <div className="form-group">
          <label>XP Reward:</label>
          <input className="quest-input" type="number" value={xp} onChange={(e) => setXp(Number(e.target.value))} min="10" max="500" />
        </div>
        <button type="submit" className="quest-btn" style={{ width: '100%', marginTop: '10px' }}>Accept Quest 📜</button>
      </form>

      {/* QUESTS LIST */}
      <div className="quest-list">
        {quests.map((quest) => (
          <div key={quest.id} className={`quest-row ${quest.is_completed ? 'completed' : ''}`}>
            <div className="quest-info">
              <h4>{quest.title} <span style={{ color: 'var(--color-powder-blue)' }}>({quest.xp_reward} XP)</span></h4>
              <p>{quest.description}</p>
            </div>
            <button 
              onClick={() => toggleQuest(quest.id)} 
              className="quest-btn" 
              style={{
                backgroundColor: quest.is_completed ? 'var(--color-midnight-violet)' : 'var(--color-wheat)',
                color: quest.is_completed ? 'var(--color-seashell)' : 'var(--color-midnight-violet)',
                padding: '5px 12px',
                fontSize: '1rem',
                boxShadow: 'none'
              }}
            >
              {quest.is_completed ? 'Undo ✅' : 'Complete ⚔️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;