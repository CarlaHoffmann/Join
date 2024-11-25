// Kategorisiert Tasks basierend auf ihrem Status
function categorizeTasks(tasks) {
    open = tasks.filter(t => t[1] && t[1]['status'] === 'open');
    inProgress = tasks.filter(t => t[1] && t[1]['status'] === 'in progress');
    awaitFeedback = tasks.filter(t => t[1] && t[1]['status'] === 'await feedback');
    done = tasks.filter(t => t[1] && t[1]['status'] === 'done');
}


