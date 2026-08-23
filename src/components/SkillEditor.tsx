import { abilityLabels, skills } from '../data/gameData';
import { useI18n } from '../i18n';

interface Props {
  proficient: string[];
  expertise: string[];
  onChange: (proficient: string[], expertise: string[]) => void;
}

export function SkillEditor({ proficient, expertise, onChange }: Props) { const {tr,name}=useI18n();
  const toggleProficiency = (id: string) => {
    const enabled = proficient.includes(id);
    onChange(enabled ? proficient.filter((skill) => skill !== id) : [...proficient, id], enabled ? expertise.filter((skill) => skill !== id) : expertise);
  };
  const toggleExpertise = (id: string) => {
    if (!proficient.includes(id)) return;
    onChange(proficient, expertise.includes(id) ? expertise.filter((skill) => skill !== id) : [...expertise, id]);
  };
  return <div className="check-grid">{skills.map((skill) => <div className="skill-choice" key={skill.id}>
    <label><input type="checkbox" checked={proficient.includes(skill.id)} onChange={() => toggleProficiency(skill.id)} /><span>{name(skill.id,skill.name)}<small>{name(skill.ability,abilityLabels[skill.ability])}</small></span></label>
    <label className="expertise"><input type="checkbox" disabled={!proficient.includes(skill.id)} checked={expertise.includes(skill.id)} onChange={() => toggleExpertise(skill.id)} /> {tr('Expertise')}</label>
  </div>)}</div>;
}
