// Sample Data Store for Caytori Centralized IT Support Management
let tickets = [
    {
        id: "TICK-8021",
        subject: "VPN authentication failure on macOS Sequoia",
        requester: "Marcus Vance",
        category: "Network",
        priority: "high",
        status: "Open",
        date: "10 mins ago"
    },
    {
        id: "TICK-8020",
        subject: "New employee hardware onboarding & monitor setup",
        requester: "Elena Rostova",
        category: "Hardware",
        priority: "medium",
        status: "In Progress",
        date: "42 mins ago"
    },
    {
        id: "TICK-8019",
        subject: "Figma enterprise workspace access request",
        requester: "Devon Zhao",
        category: "Software",
        priority: "low",
        status: "Resolved",
        date: "2 hours ago"
    },
    {
        id: "TICK-8018",
        subject: "Critical security patch deployment error on Server Node 04",
        requester: "Ops Automated Monitor",
        category: "Security",
        priority: "high",
        status: "In Progress",
        date: "3 hours ago"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    renderTickets();
    initFilterAndSearch();
    initModalAndForm();
});

// Tab Switcher
function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-tab");
            document.getElementById(targetId).classList.add("active");
        });
    });
}

// Render Ticket Data Table
function renderTickets() {
    const tableBody = document.getElementById("ticket-table-body");
    const searchVal = (document.getElementById("ticket-search")?.value || "").toLowerCase();
    const priorityVal = document.getElementById("priority-filter")?.value || "all";

    const filtered = tickets.filter(ticket => {
        const matchesSearch = 
            ticket.id.toLowerCase().includes(searchVal) ||
            ticket.subject.toLowerCase().includes(searchVal) ||
            ticket.requester.toLowerCase().includes(searchVal) ||
            ticket.category.toLowerCase().includes(searchVal);
        
        const matchesPriority = priorityVal === "all" || ticket.priority === priorityVal;

        return matchesSearch && matchesPriority;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    No IT support tickets matching current filter criteria.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filtered.map(t => {
        let statusClass = "status-open";
        if (t.status === "In Progress") statusClass = "status-progress";
        if (t.status === "Resolved") statusClass = "status-resolved";

        return `
            <tr>
                <td class="ticket-id">${t.id}</td>
                <td class="ticket-subject">${t.subject}</td>
                <td>${t.requester}</td>
                <td>${t.category}</td>
                <td><span class="badge priority-${t.priority}">${t.priority}</span></td>
                <td><span class="status-badge ${statusClass}">${t.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="toggleResolve('${t.id}')">
                        ${t.status === 'Resolved' ? 'Reopen' : 'Resolve'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Update tab counter
    const openCount = tickets.filter(t => t.status !== "Resolved").length;
    const counterElem = document.getElementById("open-ticket-count");
    if (counterElem) counterElem.textContent = openCount;
}

// Toggle ticket status
function toggleResolve(id) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
        if (ticket.status === "Resolved") {
            ticket.status = "In Progress";
            showToast(`Ticket ${id} reopened.`);
        } else {
            ticket.status = "Resolved";
            showToast(`Ticket ${id} marked as resolved!`);
        }
        renderTickets();
    }
}

// Event Listeners for Filters
function initFilterAndSearch() {
    const searchInput = document.getElementById("ticket-search");
    const prioritySelect = document.getElementById("priority-filter");

    if (searchInput) searchInput.addEventListener("input", renderTickets);
    if (prioritySelect) prioritySelect.addEventListener("change", renderTickets);
}

// Modal & Form Handlers
function initModalAndForm() {
    const modal = document.getElementById("ticket-modal");
    const form = document.getElementById("new-ticket-form");
    const btnNew = document.getElementById("btn-new-ticket");

    if (btnNew) {
        btnNew.addEventListener("click", openTicketModal);
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const requester = document.getElementById("requester-name").value.trim();
            const subject = document.getElementById("ticket-subject").value.trim();
            const category = document.getElementById("ticket-category").value;
            const priority = document.getElementById("ticket-priority").value;

            const newTicket = {
                id: `TICK-${Math.floor(8022 + Math.random() * 100)}`,
                subject: subject,
                requester: requester,
                category: category,
                priority: priority,
                status: "Open",
                date: "Just now"
            };

            tickets.unshift(newTicket);
            renderTickets();
            closeTicketModal();
            form.reset();
            showToast(`New Ticket ${newTicket.id} logged successfully!`);
        });
    }
}

function openTicketModal() {
    const modal = document.getElementById("ticket-modal");
    if (modal) modal.classList.add("active");
}

function closeTicketModal() {
    const modal = document.getElementById("ticket-modal");
    if (modal) modal.classList.remove("active");
}

function scrollToConsole() {
    const el = document.getElementById("dashboard");
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg) {
    const toast = document.getElementById("toast-msg");
    if (toast) {
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }
}
