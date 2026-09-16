import React from 'react';
import system from '../ufo-system.json';

export default function OperatingMap() {
  return <section className="max-w-7xl mx-auto px-6 py-12 space-y-10" aria-label="UFO operating map">
    <div className="max-w-3xl space-y-4">
      <h2 className="font-spectral text-3xl">Your mothership. Your choices.</h2>
      <p className="text-base leading-relaxed">{system.identity}</p>
      <p className="text-base">This is the founder’s named example. Your own UFO can have its own names, agents and satellites.</p>
    </div>
    <details open className="border border-black p-5">
      <summary className="cursor-pointer text-xl font-spectral">Houses, products + cadences</summary>
      <div className="overflow-x-auto mt-5">
        <table className="w-full text-left text-base border-collapse">
          <caption className="text-left pb-4">Twelve operating departments; Creation is the person acting across them in the present.</caption>
          <thead><tr>{['House', 'Product / platform', 'Cadence + purpose'].map(h => <th className="p-3 border-b border-black" scope="col" key={h}>{h}</th>)}</tr></thead>
          <tbody>{system.houses.map(h => <tr key={h.number}>
            <th scope="row" className="p-3 border-b border-gray-200 align-top min-w-40">{h.number}. {h.department}</th>
            <td className="p-3 border-b border-gray-200 align-top min-w-40">{h.product || 'You, in the present'}<br/><span className="text-gray-600">{h.platform || 'No separate platform'}</span></td>
            <td className="p-3 border-b border-gray-200 align-top min-w-56"><strong>{h.cadence}</strong><p className="mt-2">{h.description}</p></td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
    <details className="border border-black p-5">
      <summary className="cursor-pointer text-xl font-spectral">The week inside every house</summary>
      <div className="grid md:grid-cols-2 gap-5 mt-5">{system.weekdays.map(d => <article key={d.day}><h3 className="font-bold">{d.day} — {d.theme}</h3><p className="mt-2">{d.scope}</p></article>)}</div>
    </details>
    <details className="border border-black p-5">
      <summary className="cursor-pointer text-xl font-spectral">24-hour engines + daily scorecard</summary>
      <p className="mt-5">House 5 supplies the sprint tasks and timing scorecard. House 7 coordinates agent execution, handoffs and completion receipts. Honey from the Rock is the overall daily routine.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">{system.blocks.map(b => <div key={b.name} className="border border-gray-300 p-4"><h3 className="font-bold">{b.name}</h3><p>{b.start}–{b.end}</p><p className="text-sm text-gray-600 mt-2">Timing source awaiting verification</p></div>)}</div>
      <p>Red, green, yellow and gray are timing guidance. No live timing is fabricated here, and a timing light never grants permission to trade, spend or publish.</p>
      <p className="mt-3">Engine design: trigger → inputs → agent work → permitted action or human handoff → output receipt → carry forward unfinished work → next daily cycle.</p>
      <p className="mt-3 text-gray-600">Defined workflows are not running background agents. Exact sprint scheduling and lunar-phase maintenance rules still need verification.</p>
    </details>
    <details className="border border-black p-5">
      <summary className="cursor-pointer text-xl font-spectral">Connect your own satellite</summary>
      <ol className="list-decimal pl-6 space-y-2 mt-5"><li>Name the external entity and its purpose.</li><li>Choose its house, responsible agent and engine.</li><li>Choose an available connection: API, connector, file exchange or manual handoff.</li><li>Define permitted inputs, expected outputs, owner and completion evidence.</li><li>Verify one complete handoff before marking it connected.</li></ol>
      <p className="mt-4">OpenCase AI is user-reported in use with a manual handoff to define. Spring Code is a placeholder, not a working connection. New satellites added in this preview last only for the current session.</p>
    </details>
    <details className="border border-black p-5">
      <summary className="cursor-pointer text-xl font-spectral">Next project — Sunshine Pocket Therapy</summary>
      <p className="mt-5">North Node / retirement plan. A proposed family-office benefits package combining insurance, telemedicine, legal coordination and Universal Family Office design.</p>
      <p className="mt-3">Proposed delivery partners: Globe Life / American Income Life, Impact Health USA and WealthCouncil. Partner agreements, service scope, eligibility and prices are not yet confirmed.</p>
      <p className="mt-3">Next deliverables: package concept, website and proposal. The NFL is the prospective first group; no affiliation or signed customer relationship is claimed.</p>
    </details>
  </section>;
}
