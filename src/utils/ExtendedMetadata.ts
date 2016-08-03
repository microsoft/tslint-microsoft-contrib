
import * as Lint from 'tslint/lib/lint';

/**
 * Additional information that each rule must specify.
 */
export interface ExtendedMetadata extends Lint.IRuleMetadata {
    issueClass: IssueClass;
    issueType: IssueType;
    severity: Severity;
    level: Level;
    group: Group;
    recommendation?: string;
    commonWeaknessEnumeration?: string;
}

export type IssueClass = 'SDL' | 'Non-SDL' | 'Ignored';
export type IssueType = 'Error' | 'Warning';
export type Severity = 'Critical' | 'Important' | 'Moderate' | 'Low';
export type Level = 'Mandatory' | 'Opportunity for Excellence';
export type Group = 'Ignored' | 'Security' | 'Correctness' | 'Clarity' | 'Whitespace' | 'Configurable' | 'Deprecated';

