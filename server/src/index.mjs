import { createDevServer, srcDir } from './server.mjs';
import { createWatcher } from './watcher.mjs';

createDevServer();
createWatcher(srcDir);