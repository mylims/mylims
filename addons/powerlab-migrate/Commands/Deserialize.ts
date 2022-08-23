// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand } from '@adonisjs/core/build/standalone';

import type EditorImageModel from '../../../app/Models/EditorImage';
import { Sample as SampleModel } from '../../../app/Models/Sample';
import { toLexical } from '../deserialize';

export default class Deserialize extends BaseCommand {
  public static commandName = 'powerlab:deserialize';
  public static description = 'Parse from HTML to Slate';

  public static settings = { loadApp: true };

  private deps: {
    Sample: typeof SampleModel;
    EditorImage: typeof EditorImageModel;
  };

  public async run() {
    const { Sample } = await import('../../../app/Models/Sample');
    const { default: EditorImage } = await import(
      '../../../app/Models/EditorImage'
    );

    this.deps = { Sample, EditorImage };

    await this.executeParsing();
  }

  /**
   * Main function to import samples from slims
   */
  private async executeParsing() {
    this.logger.info('Starting migration');
    const startTime = process.hrtime.bigint();

    // Get all migrated samples
    const migratedSamples = await this.deps.Sample.query({
      labels: 'migrated',
      'meta.legacyContent': { $exists: true, $ne: null },
    }).all();

    // Deserialize the legacy samples
    let errors = 0;
    for (const sample of migratedSamples) {
      try {
        const { legacyContent, slimsImage } = sample.meta;
        const editorContent = await toLexical(
          legacyContent as string,
          slimsImage as string,
        );
        sample.description = editorContent;
        await sample.save();
      } catch (error) {
        this.logger.error(error);
        errors++;
      }
    }

    const endTime = process.hrtime.bigint() - startTime;
    const displayTime = (Number(endTime) / 1e9).toFixed(4);
    this.logger.info(
      `Parsed ${migratedSamples.length} samples with ${errors} errors`,
    );
    this.logger.info(`Finished parsing in ${displayTime}s`);
  }
}
