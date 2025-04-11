async function loadMonsters() {
  const response = await fetch("monsters.json");
  const monsters = (await response.json()).filter((m) => m.name);

  // Sort monsters alphabetically by name
  monsters.sort((a, b) => a.name.localeCompare(b.name));

  const tableBody = document.querySelector("#monsterTable tbody");
  const tableHead = document.querySelector("#monsterTable thead tr");
  const searchInput = document.getElementById("search");
  const crFilter = document.getElementById("crFilter");
  const detailBox = document.getElementById("monsterDetail");
  const monsterTable = document.getElementById("monsterTable");
  const searchContainer = document.querySelector("#search").parentElement;

  const allKeys = ["name", "type", "alignment", "CR", "HP", "AC"];

  // Create table headers
  tableHead.innerHTML = "";
  Array.from(allKeys).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    tableHead.appendChild(th);
  });

  function render(monsters) {
    tableBody.innerHTML = "";
    monsters.forEach((m, index) => {
      const row = document.createElement("tr");
      row.classList.add("clickable-row");

      // Add cells for each possible key
      Array.from(allKeys).forEach((key) => {
        const cell = document.createElement("td");
        if (m.hasOwnProperty(key)) {
          cell.textContent = m[key];
        } else {
          cell.textContent = "-";
          cell.classList.add("missing-data");
        }
        row.appendChild(cell);
      });

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
        ${m.type} | ${m.alignment} | Page ${m.page || "Unknown"}</p>
        <p><strong>AC:</strong> ${m.AC} | <strong>HP:</strong> ${
      m.HP
    } | <strong>Initiative:</strong> ${m.initiative}</p>
        <p><strong>Speed:</strong> ${m.speed}</p>
        <div class="warning">⚠️ Warning! Some of these values, especially the saves might be wrong, double check with the book</div>
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
        ${
          m.resistances
            ? `<p><strong>Resistances:</strong> ${m.resistances}</p>`
            : ""
        }
        ${
          m.immunities
            ? `<p><strong>Immunities:</strong> ${m.immunities}</p>`
            : ""
        }
        <p><strong>Senses:</strong> ${m.senses}</p>
        <p><strong>Languages:</strong> ${m.languages}</p>
        <p><strong>CR:</strong> ${m.CR}</p>
        ${
          m.traits
            ? `<p><h3><strong><em>Traits:</em></strong></h3>${m.traits}</p>`
            : ""
        }
        ${
          m.actions
            ? `<p><h3><strong><em>Actions:</em></strong></h3>${m.actions}</p>`
            : ""
        }
        ${
          m.bonus_actions
            ? `<p><h3><strong><em>Bonus Actions:</em></strong></h3>${m.bonus_actions}</p>`
            : ""
        }
        ${
          m.reactions
            ? `<p><h3><strong><em>Reactions:</em></strong></h3>${m.reactions}</p>`
            : ""
        }
        ${
          m.legendary_actions
            ? `<p><h3><strong><em>Legendary Actions:</em></strong></h3>${m.legendary_actions}</p>`
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

  // Extract unique CR values and prepare for custom sorting
  const uniqueCRs = [
    ...new Set(monsters.map((m) => m.CR?.split(" ")?.[0] ?? "N/A")),
  ].filter((cr) => cr !== "N/A");

  // Custom sort function for CR values
  uniqueCRs.sort((a, b) => {
    // Handle fractional CRs
    if (a === "0") return -1;
    if (b === "0") return 1;

    if (a.includes("/") && !b.includes("/")) return -1;
    if (!a.includes("/") && b.includes("/")) return 1;

    if (a.includes("/") && b.includes("/")) {
      // Compare fractional values
      const fractionA = eval(a);
      const fractionB = eval(b);
      return fractionA - fractionB;
    }

    // Compare numeric values
    return parseInt(a) - parseInt(b);
  });

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
