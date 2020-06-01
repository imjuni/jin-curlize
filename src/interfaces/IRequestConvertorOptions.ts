/**
 * Generate Option
 */
export interface IRequestConvertorOptions {
  /** prettify command. use newline charactor */
  prettify: boolean;

  /** indent size, it pass to stringify */
  indent?: number;

  /**
   * Header filter by passed keyword. undefined set default value ['connection', 'accept',
   * 'content-length', 'user-agent].
   */
  headerFilterKeywords?: string[];

  /**
   * Disable redirection follow option. this option not setted or false, add --location option.
   */
  disableFollowRedirect?: boolean;

  /**
   * add uuid to querystring. It use uuidgen command-line utility. If uuid string not empty that jin-curlize add to
   * uuid parameter by passed string.
   * */
  uuid?: {
    /**
     * uuid generation command-line tool name with path, uuidgen or uuid
     *
     * * example
     * uuidgen                      # linux or macosx
     * or
     * /proc/sys/kernel/random/uuid # linux only
     * */
    command: string;
    paramName: string;
  };
}
