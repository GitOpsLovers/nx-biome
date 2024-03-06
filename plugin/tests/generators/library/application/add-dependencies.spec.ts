import { Tree, addDependenciesToPackageJson } from '@nx/devkit';
import addDependencies from '../../../../src/generators/library/application/add-dependencies.use-case';

jest.mock('@nx/devkit', () => ({
    ...jest.requireActual('@nx/devkit'),
    addDependenciesToPackageJson: jest.fn(),
}));

describe('addDependencies', () => {
    it('should call addDependenciesToPackageJson with the correct arguments', () => {
        const tree = {} as Tree;

        addDependencies(tree);

        expect(addDependenciesToPackageJson).toHaveBeenCalledWith(
            tree,
            {},
            {
                sass: '1.71.0',
                stylelint: '16.2.1',
                'stylelint-config-standard-scss': '13.0.0',
                'nx-stylelint': '17.1.4',
            },
            undefined,
            false,
        );
    });
});
