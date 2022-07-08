/**
 * Adding extra metadata to the tests.
 * 
 * Note that this module is _not_ part of the report generation; it is supposed to be ran separately. It is kept alongside the 
 * report generation script because it reuses some tools in the library.
 * 
 * Note that the generation of an MiniApp file (ie, the zipped content) is done in a separate module in the library.
 * 
 * 
 *  @packageDocumentation
 */

import * as fs_old_school from "fs";
const fs = fs_old_school.promises;

import {get_list_dir, isDirectory, get_jsonld_file} from './lib/data';
import { Constants } from './lib/types';
import { create_miniapp } from './lib/miniapp';


/**
 * Main entry point for the separate metadata extension: modify the test.jsonld file 
 * for each test directory, and generate the MiniApp files themselves.
 */
async function main(new_metadata: string[], cut_off_pattern: string): Promise<void> {
    const dir_name: string = Constants.TESTS_DIR;
    const handle_single_test_metadata = async (file_name: string): Promise<void> => {
        const metadata_file_name = await get_jsonld_file(file_name)
        const metadata_file = await `${file_name}/${metadata_file_name}`;
        const metadata_jsonld = await fs.readFile(metadata_file,'utf-8');

        const lines: string[] = metadata_jsonld.split(/\n/);
        // let us avoid doing things twice...
        if (lines.indexOf(new_metadata[0]) === -1) {
            //1. Find the cut-off point, ie, where the new lines must be inserted:
            let index = -1;
            for (index = 0; index < lines.length; index++) {
                if (lines[index].includes(cut_off_pattern)) {
                    break
                }
            }

            // 2. insert the extra data
            const final_lines = [...lines.slice(0,index), ...new_metadata, ...lines.slice(index)];
        
            // 3. Write back the data into the MiniApp file
            await fs.writeFile(metadata_file, final_lines.join('\n'));
        }
    }

    const dirs: string[] = await get_list_dir(dir_name, isDirectory);

    // Modify the metadata content for the tests
    const dir_promises: Promise<void>[] = dirs.map((test) => handle_single_test_metadata(`${dir_name}/${test}`));
    await Promise.all(dir_promises);

    // Generate the miniapp ZIP files themselves
    const miniapp_promises: Promise<void>[] = dirs.map((test) => create_miniapp(`${dir_name}/${test}`));
    await Promise.all(miniapp_promises);
}


// =========================== Entry point for adding expressions for rights ======== 
/**
 * The extra metadata items to be added to the package metadata
 */
const DC_Rights: string[] = [
    '   "dcterms:rights": "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",',
    '   "dcterms:rightsHolder": "https://www.w3.org",',
]

/**
 * The pattern to be used to find the target for the new metadata entries. They will be inserted
 * _before_ the first occurrence of the pattern among the other metadata lines.
 */
const cutoff_meta_property: string = '"@type": "earl:TestCase"';

main(DC_Rights, cutoff_meta_property);
