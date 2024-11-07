<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

  <xsl:template match="/test-run">
    <testsuites name="{@name}" classname="{@fullname}" tests="{@testcasecount}" failures="{@failed}" skipped="{@skipped}" assertions="{@asserts}" time="{@duration}">
      <xsl:apply-templates/>
    </testsuites>
  </xsl:template>

  <xsl:template match="test-suite">
    <xsl:if test="test-case">
      <testsuite name="{@name}" classname="{@fullname}" tests="{@testcasecount}" time="{@duration}" failures="{@failed}" skipped="{@skipped}" timestamp="{@start-time}">
        <xsl:apply-templates select="test-case"/>
      </testsuite>
      <xsl:apply-templates select="test-suite"/>
    </xsl:if>
    <xsl:if test="not(test-case)">
      <xsl:apply-templates/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="test-case">
    <testcase name="{@name}" classname="{@fullname}" time="{@duration}" status="{replace(@result,'Ignored','Skipped')}">
      <xsl:if test="@result = 'Skipped' or @result = 'Ignored'">
        <xsl:choose>
          <xsl:when test="./reason/message">
            <skipped message="{./reason/message}"/>
          </xsl:when>
          <xsl:otherwise>
            <skipped/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:if test="@result = 'Failed'">
        <failure message="{./failure/message}">
          <xsl:value-of select="./failure/stack-trace"/>
        </failure>
      </xsl:if>

      <xsl:apply-templates select="output"/>
      <xsl:apply-templates select="properties"/>
      <xsl:apply-templates select="test-case"/>
<!--      <xsl:apply-templates/>-->
    </testcase>
  </xsl:template>

  <xsl:template match="output">
    <system-out>
      <xsl:value-of select="."/>
    </system-out>
  </xsl:template>

  <xsl:template match="properties">
    <xsl:if test="property">
        <properties>
          <xsl:for-each select="property">
            <property name="{@name}" value="{@value}"/>
          </xsl:for-each>
        </properties>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>

