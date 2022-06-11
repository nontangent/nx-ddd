import { ExecutorContext } from '@nrwl/devkit';
import {
  compileTypeScript,
  compileTypeScriptWatcher,
} from '@nrwl/workspace/src/utilities/typescript/compilation';
import { createAsyncIterable } from '@nrwl/js/src/utils/create-async-iterable/create-async-iteratable';
import { NormalizedExecutorOptions } from '@nrwl/js/src/utils/schema';
import { loadTsTransformers } from '@nrwl/js/src/utils/typescript/load-ts-transformers';
import type {
  CustomTransformers,
  Diagnostic,
  Program,
} from 'typescript';

export async function* compileTypeScriptFiles(
  normalizedOptions: NormalizedExecutorOptions & { srcRootForCompilationRoot?: string },
  context: ExecutorContext,
  postCompilationCallback: () => void | Promise<void>
) {
  const getResult = (success: boolean) => ({
    success,
    outfile: normalizedOptions.mainOutputPath,
  });

  const { compilerPluginHooks } = loadTsTransformers(
    normalizedOptions.transformers
  );

  const getCustomTransformers = (program: Program): CustomTransformers => ({
    before: compilerPluginHooks.beforeHooks.map(
      (hook) => hook(program) as any
    ),
    after: compilerPluginHooks.afterHooks.map(
      (hook) => hook(program) as any
    ),
    afterDeclarations: compilerPluginHooks.afterDeclarationsHooks.map(
      (hook) => hook(program) as any
    ),
  });

  const tscOptions = {
    outputPath: normalizedOptions.outputPath,
    projectName: context.projectName,
    projectRoot: normalizedOptions.projectRoot,
    tsConfig: normalizedOptions.tsConfig,
    watch: normalizedOptions.watch,
    rootDir: normalizedOptions?.srcRootForCompilationRoot,
    getCustomTransformers,
  };

  return yield* createAsyncIterable<{ success: boolean; outfile: string }>(
    async ({ next, done }) => {
      if (normalizedOptions.watch) {
        compileTypeScriptWatcher(tscOptions as any, async (d: Diagnostic) => {
          if (d.code === 6194) {
            await postCompilationCallback();
            next(getResult(true));
          }
        });
      } else {
        const { success } = compileTypeScript(tscOptions as any);
        await postCompilationCallback();
        next(getResult(success));
        done();
      }
    }
  );
}
