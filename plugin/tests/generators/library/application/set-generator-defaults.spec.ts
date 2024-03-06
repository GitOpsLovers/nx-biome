import { Tree, readNxJson, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import setGeneratorDefaults from '../../../../src/generators/library/application/set-generator-defaults.use-case';

jest.mock('@nx/devkit');

describe('setGeneratorDefaults', () => {
    let appTree: Tree;

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should set generator defaults', () => {
        const mockNxJson = {
            generators: {
                '@gitopslovers/nx-sass:library': {},
            },
        };

        (readNxJson as jest.Mock).mockReturnValueOnce(mockNxJson);

        setGeneratorDefaults(appTree);

        expect(readNxJson).toHaveBeenCalledWith(appTree);
        expect(updateNxJson).toHaveBeenCalledWith(appTree, {
            ...mockNxJson,
            generators: {
                ...(mockNxJson.generators || {}),
                '@gitopslovers/nx-sass:library': {},
            },
        });
    });

    it('should create generator configuration if none exists', () => {
        const mockNxJson = {};

        (readNxJson as jest.Mock).mockReturnValueOnce(mockNxJson);

        setGeneratorDefaults(appTree);

        expect(readNxJson).toHaveBeenCalledWith(appTree);
        expect(updateNxJson).toHaveBeenCalledWith(appTree, {
            generators: {
                '@gitopslovers/nx-sass:library': {},
            },
        });
    });
});
