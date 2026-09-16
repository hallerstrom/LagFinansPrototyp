import { useMemo, useState } from 'react';

type Role = 'association' | 'team' | 'parent';
type View = 'overview' | 'projects' | 'funding' | 'participants' | 'reports';

const money = (n:number) => new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(n);

const projects = [
  {id:1,name:'Cupresa 2027',budget:180000,funded:128500,participants:20,status:'Pågår'},
  {id:2,name:'Träningsläger vår',budget:48000,funded:39000,participants:22,status:'Pågår'},
  {id:3,name:'Material 2027',budget:24000,funded:24000,participants:24,status:'Finansierat'},
];

const sources = [
  {name:'Gemensam lagkassa',amount:40000,target:40000},
  {name:'Sponsring',amount:15000,target:20000},
  {name:'Newbody',amount:28500,target:30000},
  {name:'Bingolotto',amount:9000,target:10000},
  {name:'Deltagarbetalningar',amount:36000,target:80000},
];

const participants = [
  {name:'Alex',financed:3200,remaining:1050,status:'Pågår'},
  {name:'Charlie',financed:4250,remaining:0,status:'Klar'},
  {name:'Noel',financed:2800,remaining:1450,status:'Pågår'},
  {name:'Sam',financed:3700,remaining:550,status:'Pågår'},
  {name:'Robin',financed:4250,remaining:0,status:'Klar'},
];

export default function App(){
  const [role,setRole] = useState<Role>('team');
  const [view,setView] = useState<View>('overview');
  const [selectedProject,setSelectedProject] = useState(projects[0]);

  const copy = {
    association:{eyebrow:'FÖRENINGSVY',title:'IK Franke',subtitle:'Styrning, kontroll och ekonomisk uppföljning över samtliga lag.'},
    team:{eyebrow:'LAGVY',title:'IK Franke P90',subtitle:'Planera aktiviteter och följ hur laget finansierar dem.'},
    parent:{eyebrow:'FAMILJEVY',title:'Min översikt',subtitle:'Se barnets aktiviteter, betalningar och vad som återstår.'},
  }[role];

  const stats = useMemo(()=>{
    if(role==='association') return [
      ['Aktiva lag','18','+2 senaste året'],['Aktiva projekt','11','7 kräver uppföljning'],['Projektbudget',money(1270000),'Hela föreningen'],['Återstår finansiera',money(328000),'26 % av budget']
    ];
    if(role==='parent') return [
      ['Aktiva aktiviteter','2','IK Franke P90'],['Totalt återstår',money(1600),'För din familj'],['Registrerat betalt',money(6900),'Den här säsongen'],['Nästa deadline','30 sep','Cupresa 2027']
    ];
    return [
      ['Lagkassa',money(63500),'10 500 kr ej avsatt'],['Aktiva projekt','3','2 pågående'],['Årets finansiering',money(191500),'+18 % mot föregående år'],['Återstår finansiera',money(60500),'Alla projekt']
    ];
  },[role]);

  const remaining = selectedProject.budget-selectedProject.funded;
  const percent = Math.round(selectedProject.funded/selectedProject.budget*100);

  const nav:{key:View,label:string}[]=[
    {key:'overview',label:'Översikt'},
    {key:'projects',label:'Projekt'},
    {key:'funding',label:'Finansiering'},
    {key:'participants',label:'Deltagare'},
    {key:'reports',label:'Rapporter'},
  ];

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark">LF</div><div><b>LagFinans</b><small>Från kostnad till aktivitet</small></div></div>

      <div>
        <div className="label">Visa prototyp som</div>
        <div className="role-switch">
          <button className={role==='association'?'active':''} onClick={()=>setRole('association')}>Förening</button>
          <button className={role==='team'?'active':''} onClick={()=>setRole('team')}>Lag</button>
          <button className={role==='parent'?'active':''} onClick={()=>setRole('parent')}>Förälder</button>
        </div>
      </div>

      <nav>
        <div className="label">Navigation</div>
        {nav.map(n=><button key={n.key} className={view===n.key?'active':''} onClick={()=>setView(n.key)}>{n.label}</button>)}
      </nav>

      <div className="sidebar-bottom"><div className="avatar">IK</div><div><b>Prototypkonto</b><small>IK Franke</small></div></div>
    </aside>

    <main>
      <header>
        <div><span className="eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
        <button className="primary">+ Nytt projekt</button>
      </header>

      <div className="content">
        <section className="stats">
          {stats.map(([a,b,c])=><article key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></article>)}
        </section>

        {view==='overview' && <>
          <section className="two-col">
            <article className="card">
              <div className="card-head"><div><span className="tag">Aktivt projekt</span><h2>{selectedProject.name}</h2><p>IK Franke P90 · {selectedProject.participants} deltagare</p></div><button className="secondary" onClick={()=>setView('projects')}>Visa projekt</button></div>
              <div className="progress-box">
                <div className="progress-copy"><div><span>Finansierat</span><strong>{money(selectedProject.funded)}</strong></div><div className="right"><span>Återstår</span><strong>{money(remaining)}</strong></div></div>
                <div className="track"><div className="bar" style={{width:`${percent}%`}}/></div>
                <div className="progress-foot"><span>{percent}% finansierat</span><span>Budget {money(selectedProject.budget)}</span></div>
              </div>
              <div className="source-grid">
                {sources.slice(0,4).map(s=>{
                  const p=Math.min(100,Math.round(s.amount/s.target*100));
                  return <div className="source" key={s.name}><div><span>{s.name}</span><b>{money(s.amount)}</b></div><div className="mini-track"><i style={{width:`${p}%`}}/></div><small>{money(s.target)} mål</small></div>
                })}
              </div>
            </article>

            <article className="card">
              <span className="tag muted">Att göra</span><h2>Det som kräver uppmärksamhet</h2>
              <div className="tasks">
                {[['5 000 kr sponsring återstår','Cupresa 2027'],['3 familjer har slutfört finansiering','Uppdaterat idag'],['Newbody över prognos','28 500 av 30 000 kr'],['2 kvitton väntar på underlag','Material & transport']].map(([t,s])=><button key={t}><span className="taskdot">•</span><div><b>{t}</b><small>{s}</small></div><strong>→</strong></button>)}
              </div>
            </article>
          </section>

          <section className="card">
            <span className="tag muted">Kärnflöde</span><h2>Från idé till finansierad aktivitet</h2>
            <div className="flow">
              {[['1','Skapa projekt','Cup, läger eller aktivitet'],['2','Sätt budget','Kostnader och deltagare'],['3','Planera finansiering','Lagkassa, försäljning, sponsor'],['4','Följ familjer','Betalt och återstående'],['5','Rapportera','Föreningen får kontroll']].map(([n,t,d])=><div key={n}><span>{n}</span><b>{t}</b><small>{d}</small></div>)}
            </div>
          </section>
        </>}

        {view==='projects' && <section className="card">
          <div className="card-head"><div><span className="tag">Projekt</span><h2>Finansieringsprojekt</h2><p>Budget, deltagare och finansiering på ett ställe.</p></div><button className="primary">+ Skapa projekt</button></div>
          <div className="project-grid">
            {projects.map(p=>{
              const pct=Math.round(p.funded/p.budget*100);
              return <button key={p.id} className={`project ${selectedProject.id===p.id?'selected':''}`} onClick={()=>setSelectedProject(p)}><div className="project-top"><span className="tag muted">Projekt</span><span className={`status ${p.status==='Finansierat'?'good':''}`}>{p.status}</span></div><h3>{p.name}</h3><p>{p.participants} deltagare · Budget {money(p.budget)}</p><div className="track small"><div className="bar" style={{width:`${pct}%`}}/></div><div className="project-foot"><b>{pct}%</b><span>{money(p.funded)} finansierat</span></div></button>
            })}
          </div>
        </section>}

        {view==='funding' && <section className="card">
          <div className="card-head"><div><span className="tag">Finansiering</span><h2>{selectedProject.name}</h2><p>Planerade och faktiska finansieringskällor.</p></div><button className="primary">+ Lägg till källa</button></div>
          <div className="table"><div className="thead"><span>Källa</span><span>Utfall</span><span>Mål</span><span>Status</span></div>{sources.map(s=>{const pct=Math.round(s.amount/s.target*100);return <div className="trow" key={s.name}><b>{s.name}</b><span>{money(s.amount)}</span><span>{money(s.target)}</span><span className={`status ${pct>=100?'good':''}`}>{pct}%</span></div>})}</div>
        </section>}

        {view==='participants' && <section className="card">
          <span className="tag">Deltagare</span><h2>Familjernas finansieringsstatus</h2><p>Behöriga ledare ser helheten. Familjen ser endast sina egna uppgifter.</p>
          <div className="table participants"><div className="thead"><span>Deltagare</span><span>Finansierat</span><span>Återstår</span><span>Status</span></div>{participants.map(x=><div className="trow" key={x.name}><b>{x.name}</b><span>{money(x.financed)}</span><span>{money(x.remaining)}</span><span className={`status ${x.status==='Klar'?'good':''}`}>{x.status}</span></div>)}</div>
          <div className="privacy"><b>Integritetsprincip</b><p>Ingen publik topplista eller jämförelse mellan barn. Individuppgifter är privata och används för administration och transparens.</p></div>
        </section>}

        {view==='reports' && <section className="two-col">
          <article className="card"><span className="tag">Rapporter</span><h2>Ekonomisk översikt</h2>{[['Total projektbudget',252000],['Finansierat',191500],['Återstår',60500]].map(([k,v])=><div className="report-row" key={k}><span>{k}</span><b>{money(Number(v))}</b></div>)}<button className="primary full">Exportera rapport</button></article>
          <article className="card"><span className="tag muted">Spårbarhet</span><h2>Senaste händelser</h2><div className="timeline"><div><b>+ 5 000 kr</b><span>Sponsor registrerad · Idag 08:42</span></div><div><b>+ 1 250 kr</b><span>Deltagarbetalning · Igår 19:21</span></div><div><b>− 4 800 kr</b><span>Transportkostnad · 14 sep</span></div><div><b>Budget ändrad</b><span>180 000 kr · 12 sep</span></div></div></article>
        </section>}
      </div>
    </main>
  </div>
}
