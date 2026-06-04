import React, { useState } from 'react';
import '../styles/Quests.css';

export default function Quests() {
  const [quests, setQuests] = useState([
    { id: 1, title: 'Drink 2l of Water', description: 'Hidration is key to success', difficulty: 'easy', xp_reward: 10, is_completed: false }
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [xp, setXp] = useState(50);

  const handleAddQuest = (e) => {
    e.preventDefault();
    if (!title) return;

    const newQuest = {
      id: Date.now(),
      title,
      description,
      difficulty,
      xp_reward: xp,
      is_completed: false,
    };

    setQuests([...quests, newQuest]);
    setTitle('');
    setDescription('');
    setDifficulty('medium');
  };

  const toggleQuest = (id) => {
    setQuests(quests.map(q => q.id === id ? { ...q, is_completed: !q.is_completed } : q));
  };

  // Pomoćna funkcija za dobijanje boje na osnovu težine kvesta
  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return '#4CAF50';
    if (diff === 'medium') return '#FFC107';
    return '#F44336';
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="quests-header">⚔️ Quest Log ⚔️</h2>
      
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
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Difficulty:</label>
            <select className="quest-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ background: '#120224', color: 'white' }}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>XP Reward:</label>
            <input className="quest-input" type="number" value={xp} onChange={(e) => setXp(Number(e.target.value))} min="10" max="500" />
          </div>
        </div>
        <button type="submit" className="quest-btn" style={{ width: '100%', marginTop: '10px' }}>Accept Quest 📜</button>
      </form>

      <div className="quest-list">
        {quests.map((quest) => (
          <div key={quest.id} className={`quest-row ${quest.is_completed ? 'completed' : ''}`}>
            <div className="quest-info">
              <h4>{quest.title}</h4>
              <p>{quest.description}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <span style={{ color: getDifficultyColor(quest.difficulty), fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {quest.difficulty}
                </span>
                <div style={{ color: 'var(--color-powder-blue)' }}>+{quest.xp_reward} XP</div>
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
          </div>
        ))}
      </div>
    </div>
  );
}