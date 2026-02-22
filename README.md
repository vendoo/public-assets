# Public Assets Repository

This repository hosts static assets that are publicly accessible via CDN for use in our applications.

## Purpose

Centralized location for static files (JavaScript, CSS, images) that need to be:
- Publicly accessible
- Served via CDN for performance
- Versioned and tracked in Git
- Used across multiple deployments

## Usage

### Accessing Files via jsDelivr CDN

Files in this repository are automatically available through jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/<org>/<repo>@<version>/<file-path>
```

**Examples:**

```html
<!-- Latest version from main branch -->
<script src="https://cdn.jsdelivr.net/gh/vendoo/public-assets@main/api-docs/init.js"></script>

<!-- Specific version tag (recommended for production) -->
<script src="https://cdn.jsdelivr.net/gh/vendoo/public-assets@v1.0.0/api-docs/init.js"></script>

<!-- Specific commit -->
<script src="https://cdn.jsdelivr.net/gh/vendoo/public-assets@abc1234/api-docs/init.js"></script>
```

### Best Practices

1. **Use version tags in production** - Don't rely on `@main` for production deployments
2. **Create semantic version tags** - Use `v1.0.0`, `v1.1.0`, etc.
3. **Test before tagging** - Verify changes work before creating a release tag
4. **Document breaking changes** - Update this README when making incompatible changes

## Adding New Assets

1. Add your file to the appropriate directory:
   ```bash
   cp your-file.js /path/to/public-assets/
   git add your-file.js
   ```

2. Commit with a descriptive message:
   ```bash
   git commit -m "Add api helper script"
   ```

3. Push to the repository:
   ```bash
   git push origin main
   ```

4. For production use, create a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

5. Use the CDN URL in your application:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/vendoo/public-assets@v1.0.0/your-file.js"></script>
   ```

## File Organization

```
public-assets/
├── README.md
└── api-docs/
    └── init.js           # API documentation initialization
```

Organize files by purpose/category in subdirectories as shown above.

## Current Assets

### api-docs/init.js
JavaScript module for initializing API documentation interface with Mermaid diagram support.

**Features:**
- Mermaid diagram rendering
- Pan/zoom functionality
- Modal view for diagrams
- Integration with Scalar API reference

**Usage:**
```html
<script>
  window.serviceOptions = {
    sources: [/* your API specs */]
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/vendoo/public-assets@main/api-docs/init.js"></script>
```

## Versioning

This repository follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for backwards compatible bug fixes

## CDN Cache

jsDelivr CDN caching:
- **Branch references** (`@main`): Cached for 12 hours
- **Version tags** (`@v1.0.0`): Cached permanently
- **Purge cache**: Use jsDelivr's [purge tool](https://www.jsdelivr.com/tools/purge) if needed

## Security Considerations

- **No secrets or credentials** - This repository is public
- **No proprietary business logic** - Only generic utility code
- **Review before committing** - Ensure no sensitive data is included
- **Minimize external dependencies** - Keep assets self-contained when possible

## Updating Files

To update an existing asset:

1. Make your changes locally
2. Test thoroughly
3. Commit and push to main
4. Create a new version tag (bump appropriately)
5. Update consuming applications to use the new version

## Support

For questions or issues with assets in this repository, contact the DevOps or Platform team.

## Contributing

1. Make changes in a feature branch
2. Test changes locally before pushing
3. Create a PR for review (for significant changes)
4. Tag releases after merging to main
