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
import { Constants, DCRightsMetadata } from './lib/types';
import { create_miniapp } from './lib/miniapp';


/**
 * Main entry point for the separate metadata extension: modify the test.jsonld file 
 * for each test directory, and generate the MiniApp files themselves.
 */
async function main(new_metadata: DCRightsMetadata): Promise<void> {
    const dir_name: string = Constants.TESTS_DIR;
    const handle_single_test_metadata = async (file_name: string): Promise<void> => {
        const metadata_file_name = await get_jsonld_file(file_name)
        const metadata_file = await `${file_name}/${metadata_file_name}`;
        const metadata_jsonld = JSON.parse(await fs.readFile(metadata_file,'utf-8'));
        const new_metadata_keys = Object.keys(new_metadata) 
        const new_json = { ...metadata_jsonld }

        Object.keys(new_metadata).forEach(key => {
            if (! (key in metadata_jsonld)) {
                // Adds the metadata into the main JSON object
                new_json[key] = new_metadata[key];
            }
        });
 
        // If the new object has more keys than the original one
        if (Object.keys(new_json).length > new_metadata_keys.length) {
            // Write back the data into the MiniApp file
            await fs.writeFile(metadata_file, JSON.stringify(new_json, null, '  '));
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
const DC_Rights: DCRightsMetadata = { 
        'dcterms:rights' : 'https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document',
        'dcterms:rightsHolder': 'https://www.w3.org'
    };

main(DC_Rights);
