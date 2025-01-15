document.getElementById('Results').addEventListener('click' , async () => {
    const id = document.getElementById('pollingUnit-id').value;
    const response = await fetch(`/api/polling-unit/${id}`);
    const results = await response.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2> Polling unit result ${id}</h2>`;
    results.forEach(result => {
        resultsDiv.innerHTML += `<p>${result.party_abbreviation}: ${result.party_score}</p>`
    });
});