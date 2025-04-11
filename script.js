async function loadMonsters() {
  const response = await fetch("monsters.json");
  const monsters = await response.json();

  const tableBody = document.querySelector("#monsterTable tbody");
  const searchInput = document.getElementById("search");
  const crFilter = document.getElementById("crFilter");
  const detailBox = document.getElementById("monsterDetail");
  const monsterTable = document.getElementById("monsterTable");
  const searchContainer = document.querySelector("#search").parentElement;

  function render(monsters) {
    tableBody.innerHTML = "";
    monsters.forEach((m, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${m.name}</td>
          <td>${m.type}</td>
          <td>${m.CR}</td>
          <td>${m.HP}</td>
          <td>${m.AC}</td>
        `;
      row.addEventListener("click", () => showDetails(m));
      tableBody.appendChild(row);
    });
  }

  function showDetails(m) {
    // Hide the table and filters
    monsterTable.classList.add("hidden");
    searchInput.classList.add("hidden");
    crFilter.classList.add("hidden");
    
    // Show the detail box
    detailBox.classList.remove("hidden");
    detailBox.innerHTML = `
        <div class="back-button">&times;</div>
        <h2>${m.name}</h2>
        <p><strong>Type:</strong> ${m.type} | <strong>Alignment:</strong> ${
      m.alignment
    }</p>
        <p><strong>AC:</strong> ${m.AC} | <strong>HP:</strong> ${
      m.HP
    } | <strong>Initiative:</strong> ${m.initiative}</p>
        <p><strong>Speed:</strong> ${m.speed}</p>
        <div class="abilities">
          ${Object.entries(m.abilities)
            .map(
              ([stat, val]) => `
            <div>
              <strong>${stat}</strong><br/>
              ${val.total} (${val.mod})<br/>
              <small>Save: ${val.save}</small>
            </div>
          `
            )
            .join("")}
        </div>
        <p><strong>Skills:</strong> ${m.skills}</p>
        <p><strong>Senses:</strong> ${m.senses}</p>
        <p><strong>Languages:</strong> ${m.languages}</p>
        <p><strong>CR:</strong> ${m.CR}</p>
        ${m.traits ? `<p><strong>Traits:</strong><br/>${m.traits}</p>` : ""}
        ${m.actions ? `<p><strong>Actions:</strong><br/>${m.actions}</p>` : ""}
        ${
          m.reactions
            ? `<p><strong>Reactions:</strong><br/>${m.reactions}</p>`
            : ""
        }
      `;
      
    // Add event listener to the back button
    const backButton = detailBox.querySelector(".back-button");
    backButton.addEventListener("click", goBackToTable);
  }
  
  function goBackToTable() {
    // Hide the detail box
    detailBox.classList.add("hidden");
    
    // Show the table and filters
    monsterTable.classList.remove("hidden");
    searchInput.classList.remove("hidden");
    crFilter.classList.remove("hidden");
  }

  function getFiltered() {
    const query = searchInput.value.toLowerCase();
    const selectedCR = crFilter.value;

    return monsters.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(query) ||
        m.type.toLowerCase().includes(query) ||
        (m.alignment || "").toLowerCase().includes(query);
      const matchesCR = !selectedCR || m.CR.startsWith(selectedCR);
      return matchesSearch && matchesCR;
    });
  }

  const uniqueCRs = [
    ...new Set(monsters.map((m) => m.CR.split(" ")[0])),
  ].sort();
  uniqueCRs.forEach((cr) => {
    const option = document.createElement("option");
    option.value = cr;
    option.textContent = cr;
    crFilter.appendChild(option);
  });

  searchInput.addEventListener("input", () => render(getFiltered()));
  crFilter.addEventListener("change", () => render(getFiltered()));

  render(monsters);
}

loadMonsters();