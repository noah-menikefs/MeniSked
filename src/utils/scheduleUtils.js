/** Map id to display name from callList or entries */
export function idToNameFromLists(callList = [], entries = [], id) {
  const call = callList.find((c) => c.id === id);
  if (call) return call.name;
  const entry = entries.find((e) => e.id === id);
  return entry ? entry.name : "";
}

/** Return priority for a call id; default high number if missing */
export function priorityForCall(callList = [], id) {
  const found = callList.find((c) => c.id === id);
  return found ? found.priority : 1000;
}

/** Build array of call assignments from peopleList filtered to callList ids, sorted by priority */
export function buildCallSkedFromPeople(peopleList = [], callList = []) {
  const arr = [];
  for (const person of peopleList) {
    for (const work of person.worksked || []) {
      if (callList.some((c) => c.id === work.id)) {
        arr.push({
          id: work.id,
          date: work.date,
          name: person.lastname,
          colour: person.colour,
          priority: priorityForCall(callList, work.id),
        });
      }
    }
  }
  arr.sort((a, b) => a.priority - b.priority);
  return arr;
}
