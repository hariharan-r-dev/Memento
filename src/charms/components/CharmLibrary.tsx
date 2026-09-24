import React, { useState, useMemo } from 'react';
import type { CharmCategory, CharmDefinition } from '../types';
import { ALL_CHARMS } from '../registry';
import { CharmCard } from './CharmCard';

interface CharmLibraryProps {
  selectedCharmId: string;
  onSelectCharm: (charm: CharmDefinition) => void;
}

export const CharmLibrary: React.FC<CharmLibraryProps> = ({
  selectedCharmId,
  onSelectCharm,
}) => {
  const [activeCategory, setActiveCategory] = useState<CharmCategory>('all');

  const categories: { id: CharmCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'devotional', label: 'Devotional' },
    { id: 'protection', label: 'Protection' },
    { id: 'prosperity', label: 'Prosperity' },
    { id: 'calm', label: 'Calm' },
    { id: 'goals', label: 'Goals' },
    { id: 'cars', label: 'Cars' },
  ];

  const filteredCharms = useMemo(() => {
    if (activeCategory === 'all') return ALL_CHARMS;
    if (activeCategory === 'cultural') {
      return ALL_CHARMS.filter((c) => c.category === 'cultural' || c.region !== 'Global');
    }
    return ALL_CHARMS.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="charm-library-container space-y-3">
      {/* Category Text Tabs */}
      <div className="flex items-center gap-4 border-b border-white/[0.06] pb-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs font-medium transition-colors cursor-pointer relative pb-1 ${
              activeCategory === cat.id
                ? 'text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{cat.label}</span>
            {activeCategory === cat.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Grid of Compact Charm Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredCharms.map((charm) => (
          <CharmCard
            key={charm.id}
            charm={charm}
            isSelected={
              selectedCharmId === charm.id ||
              (selectedCharmId === 'lucky-cat' && charm.id === 'maneki-neko')
            }
            onSelect={onSelectCharm}
          />
        ))}
      </div>
    </div>
  );
};
