<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

  <xsl:template match="assemblies/assembly">
    <testsuites name="{@name}" classname="{@fullname}" tests="{@total}" time="{@time}" errors="{@errors}" failures="{@failed}" skipped="{@skipped}" timestamp="{@start-time}">
      <xsl:apply-templates/>
    </testsuites>
  </xsl:template>

  <xsl:template match="collection">
    <xsl:if test="test">
      <testsuite name="{replace(replace(@name, 'Test collection for ', ''),'TestSuite.','')}" tests="{@total}" time="{@time}" passed="{@passed}" failed="{@failed}" skipped="{@skipped}">
        <xsl:apply-templates select="test"/>
      </testsuite>
      <xsl:apply-templates select="collection"/>
    </xsl:if>
    <xsl:if test="not(test)">
      <xsl:apply-templates/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="test">
    <testcase name="{@method}" classname="{@type}" time="{@time}" status="{replace(replace(replace(@result,'Fail','Failed'),'Pass','Passed'),'Skip','Skipped')}">
      <xsl:if test="@result = 'Skip'">
        <xsl:choose>
          <xsl:when test="reason">
            <skipped message="{reason}"/>
          </xsl:when>
          <xsl:otherwise>
            <skipped/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:if test="@result = 'Fail'">
        <failure message="{failure/message}">
          <xsl:value-of select="failure/stack-trace"/>
        </failure>
      </xsl:if>
      <xsl:if test="traits/trait">
        <properties>
          <xsl:for-each select="traits/trait">
            <property name="{@name}" value="{@value}"/>
          </xsl:for-each>
        </properties>
      </xsl:if>
      <xsl:apply-templates select="test"/>
    </testcase>
  </xsl:template>

  <xsl:template match="command-line"/>
  <xsl:template match="settings"/>
  <xsl:template match="filter"/>

  <!-- <xsl:template match="output">
    <system-out>
      <xsl:value-of select="."/>
    </system-out>
  </xsl:template> -->

  <xsl:template match="stack-trace"/>

  <xsl:template match="test-suite/failure"/>

  <xsl:template match="test-case/assertions"/>

  <xsl:template match="test-suite/reason"/>

  <xsl:template match="properties"/>
</xsl:stylesheet>

