package com.capgemini.hyc.jira.reports;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.IssueManager;
import com.atlassian.jira.plugin.report.impl.AbstractReport;
import com.atlassian.jira.util.ParameterUtils;
import com.atlassian.jira.web.action.ProjectActionSupport;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ErFeature extends AbstractReport {
	final IssueManager manager;
	
	public ErFeature(final IssueManager manager){
		this.manager = manager;
	}
	
    public String generateReportHtml(ProjectActionSupport action, Map map) throws Exception {
    	return getParams(action, map).values().toString();
    	//return descriptor.getHtml("html-view", getParams(action, map));
    }
    
    public Map getParams(ProjectActionSupport projectActionSupport, Map map){
    	final String erID = ParameterUtils.getStringParam(map, "UserStoryID");
    	Issue erObject = manager.getIssueObject(erID);
    	Map <String, Object> featureMap = new HashMap();
    	Object[] features = erObject.getSubTaskObjects().toArray();
    	List<Issue> issueList = (List<Issue>) erObject.getSubTaskObjects();
    	featureMap.put("issueList", issueList);
    	
    	
    	return featureMap;
    	
    }
}
