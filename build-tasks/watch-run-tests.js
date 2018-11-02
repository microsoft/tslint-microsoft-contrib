const { yellowBright, red, green } = require('chalk');
const chokidar = require('chokidar');
const runAll = require('npm-run-all');

const changes = new Set();
let testsRunning = false;

function simpleDebounce(delay, fn) {
    let timer;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

function runTests() {
    console.log(green('\nStarting tests'));

    testsRunning = true;

    return runAll(['test:*', 'lint:*'], {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr
    })
        .then(() => console.log(green('\nSuccess.')))
        .catch(() => console.error(red('\nFailure!')))
        .then(() => {
            testsRunning = false;
        });
}

const scheduleTests = simpleDebounce(1000, () => {
    console.log(yellowBright('Scheduling new tests because of changes in: \n') + [...changes].join('\n'));

    changes.clear();

    runTests().then(() => {
        if (changes.size > 0) {
            scheduleTests();
        }
    });
});

function registerChange(path) {
    console.log(yellowBright('Registered change: ') + path);
    changes.add(path);

    if (!testsRunning) {
        scheduleTests();
    }
}

const fileWatcher = chokidar.watch(['dist/src/**/*.js', 'test-data/**', 'tests/**']);

function subscribeFileEvents() {
    fileWatcher
        .on('add', registerChange)
        .on('change', registerChange)
        .on('unlink', registerChange);
}

fileWatcher.on('ready', () => {
    const watchedCount = Object.keys(fileWatcher.getWatched()).reduce((memo, items) => memo + items.length, 0);
    console.log(`Watching ${watchedCount} files and folders.`);

    subscribeFileEvents();

    runTests();
});
