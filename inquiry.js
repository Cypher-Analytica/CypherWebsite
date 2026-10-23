function isInquirySuccess(responseText) {
    const text = responseText.trim();
    // The original Apps Script returns plain-text Success after submission.
    if (text === 'Success') return true;
    try {
        const result = JSON.parse(text);
        return !!(result && !result.error && result.success !== false &&
            (result.result === 'success' || result.status === 'success' || result.success === true));
    } catch {
        return false;
    }
}

// Original website's Google Sheets Apps Script deployment.
const CYPHER_INQUIRY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxwvI3euZnDLxuGyHAKvC9UIyOknfhGFW30-eDI1_LtcnHut4iSYIck2wqe7SV-OMtD/exec';
const CYPHER_SYLLABI = {
    'Data Analytics': 'pdf/Data-Analytics.pdf',
    'Data Science': 'pdf/Data-Science.pdf',
    'Data Engineering': 'pdf/Data-Engineering.pdf',
    'Business Intelligence (BI) Analyst': 'pdf/Business-Analytics.pdf',
    'Java Full Stack': 'pdf/Java-Full-Stack.pdf',
    'MERN Full Stack': 'pdf/Mern-Stack.pdf',
    'Workflow Automation': 'pdf/Workflow-Automation.pdf',
    'AI-Assisted Workflow Automation': 'pdf/AI-Assisted-Workflow-Automation.pdf',
    'AI Agent Development': 'pdf/AI-Agent-Development.pdf',
    'Advanced Agentic AI Systems': 'pdf/Advanced-Agentic-AI-Systems.pdf',
    'Tableau': 'pdf/Tableau.pdf',
    'SQL': 'pdf/SQL.pdf',
    'R Language': 'pdf/R-Programming.pdf',
    'Python Full Stack': 'pdf/Python-Full-Stack.pdf',
    'Power BI': 'pdf/Power-BI.pdf',
    'Personality Development & Communication': 'pdf/Personality-Development-and-Communication.pdf',
    'Gen AI': 'pdf/Gen-AI-Curriculum.pdf',
    'Excel': 'pdf/Excel.pdf'
};
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.querySelector('#syllabus-dialog');
    const syllabusForm = document.querySelector('#syllabus-form');
    let trigger;
    syllabusForm?.elements.course.addEventListener('change', () => {
        syllabusForm.dataset.confirmed = 'false';
        syllabusForm.querySelector('button[type="submit"]').disabled = false;
        syllabusForm.querySelector('.syllabus-download-again').hidden = true;
        syllabusForm.querySelector('[role="status"]').textContent = '';
    });
    document.querySelectorAll('[data-syllabus]').forEach(button => button.addEventListener('click', () => {
        if (!dialog || syllabusForm.getAttribute('aria-busy') === 'true') return;
        trigger = button;
        syllabusForm.dataset.pdf = button.dataset.syllabus;
        syllabusForm.dataset.confirmed = 'false';
        syllabusForm.elements.course.value = button.dataset.course;
        const status = syllabusForm.querySelector('[role="status"]');
        status.textContent = '';
        delete status.dataset.state;
        syllabusForm.querySelector('button[type="submit"]').disabled = false;
        syllabusForm.querySelector('.syllabus-download-again').hidden = true;
        dialog.showModal();
    }));
    const requestedCourse = new URLSearchParams(window.location.search).get('course');
    if (requestedCourse && CYPHER_SYLLABI[requestedCourse] && dialog && syllabusForm) {
        trigger = document.querySelector(`a[href*="course=${encodeURIComponent(requestedCourse)}"]`);
        syllabusForm.dataset.pdf = CYPHER_SYLLABI[requestedCourse];
        syllabusForm.dataset.confirmed = 'false';
        syllabusForm.elements.course.value = requestedCourse;
        syllabusForm.querySelector('[role="status"]').textContent = '';
        syllabusForm.querySelector('button[type="submit"]').disabled = false;
        syllabusForm.querySelector('.syllabus-download-again').hidden = true;
        dialog.showModal();
        window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
    }
    dialog?.querySelector('.syllabus-close').addEventListener('click', () => {
        if (syllabusForm.getAttribute('aria-busy') !== 'true') dialog.close();
    });
    dialog?.addEventListener('cancel', event => {
        if (syllabusForm.getAttribute('aria-busy') === 'true') event.preventDefault();
    });
    dialog?.addEventListener('close', () => trigger?.focus());
    document.querySelectorAll('#counseling-form, #syllabus-form').forEach(form => {
        const status = form.querySelector('[role="status"]');
        const button = form.querySelector('button[type="submit"]');
        const close = form === syllabusForm ? dialog.querySelector('.syllabus-close') : null;
        let submitting = false;
        const showStatus = (message, state) => { status.textContent = message; status.dataset.state = state; };
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (submitting || form.dataset.confirmed === 'true' || !form.reportValidity()) return;
            const fields = new FormData(form);
            const name = String(fields.get('name') || '').trim();
            const email = String(fields.get('email') || '').trim();
            const number = String(fields.get('number') || '').trim();
            const course = String(fields.get('course') || '').trim();
            const selectedPdf = form === syllabusForm ? CYPHER_SYLLABI[course] : null;
            if (form === syllabusForm && !selectedPdf) {
                showStatus('Please select a course from the list.', 'error'); return;
            }
            if (name.length < 2 || !email || !course || number.replace(/\D/g, '').length < 10) {
                showStatus('Please enter your full name, email, valid phone number and course.', 'error'); return;
            }
            const payload = new FormData();
            for (const [key, value] of Object.entries({ name, email, number, course })) payload.set(key, value);
            submitting = true; button.disabled = true;
            if (form === syllabusForm) form.elements.course.disabled = true;
            if (close) close.disabled = true;
            form.setAttribute('aria-busy', 'true');
            const label = button.textContent;
            button.textContent = 'Submitting…';
            showStatus('Please wait while we submit your details.', 'pending');
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 25000);
            let confirmed = false;
            try {
                const response = await fetch(CYPHER_INQUIRY_ENDPOINT, { method: 'POST', body: payload, signal: controller.signal, redirect: 'follow' });
                if (!response.ok || response.type === 'opaque') throw new Error('unconfirmed');
                if (!isInquirySuccess(await response.text())) throw new Error('unconfirmed');
                confirmed = true;
            } catch {
                showStatus('We could not confirm your submission. Your details are still here. Please call +91 9977784536 before trying again.', 'error');
            } finally {
                clearTimeout(timer); submitting = false; button.textContent = label; button.disabled = false;
                if (close) close.disabled = false;
                if (form === syllabusForm) form.elements.course.disabled = false;
                form.removeAttribute('aria-busy');
            }
            if (!confirmed) return;
            if (form === syllabusForm) {
                form.dataset.confirmed = 'true'; button.disabled = true;
                const download = form.querySelector('.syllabus-download-again');
                download.href = selectedPdf; download.download = selectedPdf.split('/').pop(); download.hidden = false;
                showStatus('Thank you! Your details have been submitted and your syllabus download is starting. If it does not start, use the download button below.', 'success');
                download.click();
            } else {
                showStatus('Thank you! Your inquiry has been submitted. Our team will contact you about your selected course.', 'success'); form.reset();
            }
        });
    });
});
