/**
 * Returns a string indicating the type of `obj`.
 *
 * The Object datastore is the default (and fallback) datastore for Locomotive.
 * It returns the type of any generic object instances.
 *
 * This datastore is sufficient enough to introspect datastores that represent
 * each distinct type of record with a unique class.  For cases where this
 * assumption does not hold, specialized adapters can be registered with
 * Locomotive.
 *
 * @param {Object} obj
 * @return {String}
 * @api protected
 */
exports.recordOf = function(obj) {
  if (obj instanceof Object) {
    return obj.constructor.name;
  }
  return null;
}
