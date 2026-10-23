import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        test: {
            env,
            // All test files share one database and clean it with deleteMany(),
            // so running them in parallel lets one file wipe another's data.
            fileParallelism: false
        }
    };
});